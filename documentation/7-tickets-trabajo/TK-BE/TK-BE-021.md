# TK-BE-021: Crear DTOs de CRUD dinámico

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-021 |
| **Tipo** | Backend |
| **Historia** | US-022 |
| **Título** | Crear DTOs para CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | Ninguna |

## Descripción Técnica

Crear modelos Pydantic para requests y responses del CRUD.

## Checklist de Implementación

- [ ] Crear `backend/app/application/dto/crud_dto.py`
- [ ] Crear CreateRecordRequest (data: dict)
- [ ] Crear UpdateRecordRequest (data: dict)
- [ ] Crear RecordResponse (id, created_at, data)
- [ ] Crear PagedRecordsResponse (records, pagination)
- [ ] Crear PaginationInfo (page, page_size, total_records, total_pages)

## Definición de Terminado (DoD)

- [ ] DTOs representan datos correctamente
- [ ] Paginación tiene toda la info necesaria
