# TK-BE-017: Implementar DynamicDataRepository

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-017 |
| **Tipo** | Backend |
| **Historia** | US-018 |
| **Título** | Crear repositorio para datos dinámicos |
| **Responsable** | Backend Developer |
| **Estimación** | M (40 min) |
| **Dependencias** | TK-BE-015 |

## Descripción Técnica

Crear repositorio que ejecute queries sobre tablas dinámicas usando SQLAlchemy Core.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/repositories/dynamic_data_repository.py`
- [ ] Implementar `get_records(table_name, page, page_size)`
- [ ] Implementar `get_record_by_id(table_name, id)`
- [ ] Implementar `insert_record(table_name, data)`
- [ ] Implementar `update_record(table_name, id, data)`
- [ ] Implementar `delete_record(table_name, id)`
- [ ] Implementar `count_records(table_name)`

## Definición de Terminado (DoD)

- [ ] Operaciones CRUD funcionan
- [ ] Usa parámetros (no concatenación)
- [ ] Paginación funciona
