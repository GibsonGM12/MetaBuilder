from typing import Any

from fastapi import HTTPException

from app.infrastructure.database.models import EntityFieldModel

TYPE_VALIDATORS: dict[str, tuple[type, ...]] = {
    "TEXT": (str,),
    "NUMBER": (int, float),
    "INTEGER": (int,),
    "DATE": (str,),
    "BOOLEAN": (bool,),
}


def validate_record(fields: list[EntityFieldModel], data: dict[str, Any]) -> dict[str, Any]:
    """Validate and normalize incoming data against entity field definitions.

    Returns a cleaned dict with column_name keys ready for DB insertion.
    """
    errors: list[str] = []
    known_field_names = {f.name for f in fields}
    column_map = {f.name: f.column_name for f in fields}

    unknown = set(data.keys()) - known_field_names
    if unknown:
        errors.append(f"Campos desconocidos: {', '.join(sorted(unknown))}")

    cleaned: dict[str, Any] = {}

    for field in fields:
        value = data.get(field.name)

        if value is None and field.is_required:
            errors.append(f"El campo '{field.display_name}' es requerido")
            continue

        if value is None:
            continue

        expected_types = TYPE_VALIDATORS.get(field.field_type)
        if expected_types and not isinstance(value, expected_types):
            if field.field_type == "NUMBER" and isinstance(value, bool):
                errors.append(
                    f"El campo '{field.display_name}' debe ser de tipo {field.field_type}"
                )
                continue
            errors.append(
                f"El campo '{field.display_name}' debe ser de tipo {field.field_type}"
            )
            continue

        if field.field_type == "INTEGER" and isinstance(value, bool):
            errors.append(
                f"El campo '{field.display_name}' debe ser de tipo INTEGER"
            )
            continue

        if field.field_type == "TEXT" and field.max_length and len(value) > field.max_length:
            errors.append(
                f"El campo '{field.display_name}' excede la longitud máxima de {field.max_length}"
            )
            continue

        if field.field_type == "DATE" and isinstance(value, str):
            import re
            if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
                errors.append(
                    f"El campo '{field.display_name}' debe tener formato YYYY-MM-DD"
                )
                continue
            from datetime import date as date_type
            try:
                value = date_type.fromisoformat(value)
            except ValueError:
                errors.append(
                    f"El campo '{field.display_name}' tiene una fecha inválida"
                )
                continue

        cleaned[column_map[field.name]] = value

    if errors:
        raise HTTPException(status_code=422, detail=errors)

    return cleaned
