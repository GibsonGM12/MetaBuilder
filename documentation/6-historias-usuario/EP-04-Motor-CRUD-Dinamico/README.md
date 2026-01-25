# EP-04: Motor de CRUD Dinámico (Backend)

**Objetivo**: Implementar operaciones CRUD sobre tablas dinámicas.  
**Tiempo estimado**: 8 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-018](US-018.md) | Crear repositorio de datos dinámicos | P0 | 45 min | US-016 |
| [US-019](US-019.md) | Implementar DynamicQueryBuilder | P0 | 90 min | US-018 |
| [US-020](US-020.md) | Implementar validador de datos dinámicos | P0 | 60 min | US-012 |
| [US-021](US-021.md) | Implementar DynamicCrudService | P0 | 120 min | US-019, US-020 |
| [US-022](US-022.md) | Crear DTOs para CRUD dinámico | P0 | 20 min | US-014 |
| [US-023](US-023.md) | Crear CrudRouter con endpoints REST | P0 | 75 min | US-021, US-022 |
| [US-024](US-024.md) | Implementar manejo global de errores | P0 | 30 min | US-023 |

---

## Flujo de Dependencias

```
US-016 (CREATE TABLE)
    └── US-018 (DynamicDataRepository)
            └── US-019 (QueryBuilder)
                    └── US-021 (DynamicCrudService)
                            └── US-023 (CrudRouter)
                                    └── US-024 (Error Handler)

US-012 (MetadataRepository)
    └── US-020 (DataValidator)
            └── US-021 (DynamicCrudService)

US-014 (DTOs metadatos)
    └── US-022 (DTOs CRUD)
            └── US-023 (CrudRouter)
```

---

## Tickets Relacionados

- TK-BE-017: Implementar DynamicDataRepository
- TK-BE-018: Implementar QueryBuilder
- TK-BE-019: Implementar DataValidator
- TK-BE-020: Implementar DynamicCrudService
- TK-BE-021: Crear DTOs CRUD dinámico
- TK-BE-022: Crear CrudRouter
- TK-BE-023: Implementar error handler global
