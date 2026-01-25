# TK-BE-016: Crear MetadataRouter

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-016 |
| **Tipo** | Backend |
| **Historia** | US-015 |
| **Título** | Crear router de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | M (45 min) |
| **Dependencias** | TK-BE-013, TK-BE-014, TK-BE-015 |

## Descripción Técnica

Crear router FastAPI con endpoints CRUD de metadatos.

## Checklist de Implementación

- [ ] Crear `backend/app/api/routers/metadata.py`
- [ ] Proteger con `Depends(get_current_admin)`
- [ ] Implementar GET /api/metadata/entities
- [ ] Implementar GET /api/metadata/entities/{id}
- [ ] Implementar POST /api/metadata/entities
- [ ] Implementar PUT /api/metadata/entities/{id}
- [ ] Implementar DELETE /api/metadata/entities/{id}
- [ ] Implementar POST /api/metadata/entities/{id}/fields
- [ ] Implementar DELETE /api/metadata/entities/{id}/fields/{field_id}
- [ ] Registrar router en main.py

## Definición de Terminado (DoD)

- [ ] Todos los endpoints funcionan
- [ ] Solo Admin puede acceder
- [ ] Documentación en Swagger
