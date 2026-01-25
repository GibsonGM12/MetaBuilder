# TK-BE-014: Crear DTOs de metadatos

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-014 |
| **Tipo** | Backend |
| **Historia** | US-014 |
| **Título** | Crear DTOs Pydantic para metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | S (20 min) |
| **Dependencias** | TK-BE-011 |

## Descripción Técnica

Crear modelos Pydantic para validar requests y responses de metadatos.

## Checklist de Implementación

- [ ] Crear `backend/app/application/dto/metadata_dto.py`
- [ ] Crear CreateEntityRequest
- [ ] Crear UpdateEntityRequest
- [ ] Crear EntityResponse (con lista de fields)
- [ ] Crear AddFieldRequest
- [ ] Crear FieldResponse

## Definición de Terminado (DoD)

- [ ] DTOs validan inputs
- [ ] Mapeo a/desde entidades de dominio funciona
