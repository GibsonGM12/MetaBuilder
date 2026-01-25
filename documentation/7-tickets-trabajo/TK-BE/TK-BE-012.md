# TK-BE-012: Implementar MetadataRepository

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-012 |
| **Tipo** | Backend |
| **Historia** | US-012 |
| **Título** | Implementar repositorio de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | M (40 min) |
| **Dependencias** | TK-DBA-004 |

## Descripción Técnica

Crear repositorio con operaciones CRUD para metadatos usando SQLAlchemy ORM.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/repositories/metadata_repository.py`
- [ ] Implementar `get_all_entities()`
- [ ] Implementar `get_entity_by_id(id)` con joinedload de fields
- [ ] Implementar `create_entity(entity)`
- [ ] Implementar `update_entity(id, data)`
- [ ] Implementar `delete_entity(id)`
- [ ] Implementar `add_field(entity_id, field)`
- [ ] Implementar `delete_field(field_id)`

## Definición de Terminado (DoD)

- [ ] Todas las operaciones funcionan
- [ ] get_entity_by_id incluye campos relacionados
- [ ] Delete en cascada funciona
