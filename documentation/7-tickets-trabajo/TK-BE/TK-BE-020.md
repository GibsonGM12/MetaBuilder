# TK-BE-020: Implementar DynamicCrudService

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-020 |
| **Tipo** | Backend |
| **Historia** | US-021 |
| **Título** | Implementar servicio de CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-BE-017, TK-BE-018, TK-BE-019, TK-BE-012 |

## Descripción Técnica

Crear servicio que orqueste operaciones CRUD sobre entidades dinámicas.

## Checklist de Implementación

- [ ] Crear `backend/app/application/services/crud_service.py`
- [ ] Inyectar MetadataRepository, DynamicDataRepository, QueryBuilder, DataValidator
- [ ] Implementar `get_records(entity_id, page, page_size)`
- [ ] Implementar `get_record(entity_id, record_id)`
- [ ] Implementar `create_record(entity_id, data)` con validación
- [ ] Implementar `update_record(entity_id, record_id, data)`
- [ ] Implementar `delete_record(entity_id, record_id)`

## Definición de Terminado (DoD)

- [ ] CRUD completo funciona
- [ ] Validación se ejecuta antes de insert/update
- [ ] Errores de validación se propagan
