# TK-BE-015: Implementar TableManager para DDL dinámico

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-015 |
| **Tipo** | Backend |
| **Historia** | US-016 |
| **Título** | Implementar creación dinámica de tablas |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-DBA-001 |

## Descripción Técnica

Crear TableManager que ejecute CREATE TABLE y ALTER TABLE dinámicos.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/table_manager.py`
- [ ] Implementar `create_table_for_entity(table_name, fields)`
- [ ] Implementar mapeo de FieldType a tipos SQL
- [ ] Implementar `add_column(table_name, field)`
- [ ] Implementar `drop_table(table_name)`
- [ ] Usar SQLAlchemy DDL para ejecutar

## Mapeo de Tipos

```python
TYPE_MAPPING = {
    "TEXT": lambda f: f"VARCHAR({f.max_length})" if f.max_length else "TEXT",
    "NUMBER": lambda f: "DECIMAL(10,2)",
    "INTEGER": lambda f: "INTEGER",
    "DATE": lambda f: "DATE",
    "BOOLEAN": lambda f: "BOOLEAN"
}
```

## Definición de Terminado (DoD)

- [ ] CREATE TABLE genera tabla correcta
- [ ] ALTER TABLE agrega columna
- [ ] Tipos SQL mapeados correctamente
