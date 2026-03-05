import uuid
from typing import Any

from fastapi import HTTPException, status

from app.application.dto.form_dto import FormSubmissionData, FormSubmissionResult
from app.infrastructure.database.models import FormSectionModel
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.form_repository import FormRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository


class FormSubmissionService:
    def __init__(
        self,
        form_repo: FormRepository,
        meta_repo: MetadataRepository,
        data_repo: DynamicDataRepository,
    ):
        self._forms = form_repo
        self._meta = meta_repo
        self._data = data_repo

    async def submit_form(
        self, form_id: uuid.UUID, data: FormSubmissionData
    ) -> FormSubmissionResult:
        form = await self._forms.get_form_by_id(form_id)
        if not form:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Formulario {form_id} no encontrado")

        primary_entity = await self._meta.get_entity_by_id(form.primary_entity_id)
        if not primary_entity:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Entidad principal del formulario no encontrada")

        header_data = self._map_to_columns(primary_entity.fields, data.header)

        for field_name, ref_id in data.lookups.items():
            column_name = self._find_column_name(primary_entity.fields, field_name)
            if column_name:
                header_data[column_name] = ref_id

        header_result = await self._data.insert_record(primary_entity.table_name, header_data)
        header_id = header_result["id"]

        detail_ids: list[uuid.UUID] = []
        detail_section = self._find_detail_section(form.sections)
        if detail_section and detail_section.entity_id and data.detail_lines:
            detail_entity = await self._meta.get_entity_by_id(detail_section.entity_id)
            if detail_entity:
                fk_column = self._find_fk_column(detail_entity.fields, primary_entity.id)
                for line in data.detail_lines:
                    line_data = self._map_to_columns(detail_entity.fields, line)
                    if fk_column:
                        line_data[fk_column] = str(header_id)
                    line_result = await self._data.insert_record(detail_entity.table_name, line_data)
                    detail_ids.append(line_result["id"])

        return FormSubmissionResult(
            success=True,
            header_id=header_id,
            detail_ids=detail_ids,
            message=f"Formulario enviado: {len(detail_ids)} líneas de detalle creadas",
        )

    @staticmethod
    def _map_to_columns(fields: list, data: dict[str, Any]) -> dict[str, Any]:
        result = {}
        name_to_col = {f.name: f.column_name for f in fields}
        for key, value in data.items():
            col = name_to_col.get(key, key)
            result[col] = value
        return result

    @staticmethod
    def _find_column_name(fields: list, field_name: str) -> str | None:
        for f in fields:
            if f.name == field_name:
                return f.column_name
        return None

    @staticmethod
    def _find_detail_section(sections: list[FormSectionModel]) -> FormSectionModel | None:
        for s in sections:
            if s.section_type == "DETAIL_TABLE":
                return s
        return None

    @staticmethod
    def _find_fk_column(fields: list, target_entity_id: uuid.UUID) -> str | None:
        for f in fields:
            if f.field_type == "RELATION":
                return f.column_name
        return None
