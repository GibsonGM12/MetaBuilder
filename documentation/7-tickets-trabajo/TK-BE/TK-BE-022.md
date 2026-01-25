# TK-BE-022: Crear CrudRouter

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-022 |
| **Tipo** | Backend |
| **Historia** | US-023 |
| **Título** | Crear router de CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | M (45 min) |
| **Dependencias** | TK-BE-020, TK-BE-021 |

## Descripción Técnica

Crear router FastAPI con endpoints CRUD genéricos.

## Checklist de Implementación

- [ ] Crear `backend/app/api/routers/crud.py`
- [ ] Proteger con `Depends(get_current_user)`
- [ ] Implementar GET /api/entities/{entity_id}/records
- [ ] Implementar GET /api/entities/{entity_id}/records/{record_id}
- [ ] Implementar POST /api/entities/{entity_id}/records
- [ ] Implementar PUT /api/entities/{entity_id}/records/{record_id}
- [ ] Implementar DELETE /api/entities/{entity_id}/records/{record_id}
- [ ] Registrar router en main.py

## Definición de Terminado (DoD)

- [ ] Todos los endpoints funcionan
- [ ] Admin y User pueden acceder
- [ ] Paginación funciona
