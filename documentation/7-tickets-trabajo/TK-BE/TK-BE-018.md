# TK-BE-018: Implementar QueryBuilder

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-018 |
| **Tipo** | Backend |
| **Historia** | US-019 |
| **Título** | Implementar constructor de queries dinámicas |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-BE-017 |

## Descripción Técnica

Crear clase que construya SQL dinámico basado en metadatos.

## Checklist de Implementación

- [ ] Crear `backend/app/application/services/query_builder.py`
- [ ] Implementar `build_select_query(table, fields, page, page_size)`
- [ ] Implementar `build_insert_query(table, fields, data)`
- [ ] Implementar `build_update_query(table, fields, id, data)`
- [ ] Implementar `build_delete_query(table, id)`
- [ ] Usar SQLAlchemy text() con parámetros nombrados

## Definición de Terminado (DoD)

- [ ] Queries se generan correctamente
- [ ] Sin vulnerabilidades de SQL injection
- [ ] RETURNING id funciona en INSERT
