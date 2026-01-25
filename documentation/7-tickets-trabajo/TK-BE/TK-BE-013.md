# TK-BE-013: Implementar MetadataService

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-013 |
| **Tipo** | Backend |
| **Historia** | US-013 |
| **Título** | Implementar servicio de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | L (60 min) |
| **Dependencias** | TK-BE-012 |

## Descripción Técnica

Crear servicio con lógica de negocio para gestión de metadatos.

## Checklist de Implementación

- [ ] Crear `backend/app/application/services/metadata_service.py`
- [ ] Implementar `create_entity(dto)` con validación de nombre único
- [ ] Generar table_name automáticamente como `entity_{uuid}`
- [ ] Implementar `add_field(entity_id, dto)` con validación
- [ ] Implementar métodos de lectura y eliminación
- [ ] Integrar con TableManager (siguiente ticket)

## Definición de Terminado (DoD)

- [ ] Validaciones de negocio funcionan
- [ ] table_name se genera automáticamente
- [ ] Errores descriptivos para validaciones fallidas
