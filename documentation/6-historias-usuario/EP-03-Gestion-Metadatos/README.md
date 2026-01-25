# EP-03: Gestión de Metadatos (Backend)

**Objetivo**: Implementar CRUD de entidades y campos con creación dinámica de tablas.  
**Tiempo estimado**: 6 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-010](US-010.md) | Crear entidades de dominio para metadatos | P0 | 20 min | US-004 |
| [US-011](US-011.md) | Crear tablas de metadatos en base de datos | P0 | 25 min | US-010 |
| [US-012](US-012.md) | Implementar MetadataRepository | P0 | 45 min | US-011 |
| [US-013](US-013.md) | Implementar MetadataService con lógica de negocio | P0 | 60 min | US-012 |
| [US-014](US-014.md) | Crear DTOs para metadatos | P0 | 30 min | US-010 |
| [US-015](US-015.md) | Crear MetadataRouter con endpoints REST | P0 | 60 min | US-013, US-014 |
| [US-016](US-016.md) | Implementar creación dinámica de tablas | P0 | 90 min | US-013 |
| [US-017](US-017.md) | Implementar ALTER TABLE al agregar campos | P0 | 45 min | US-016 |

---

## Flujo de Dependencias

```
US-004 (SQLAlchemy)
    └── US-010 (Entidades dominio)
            ├── US-011 (Tablas metadatos)
            │       └── US-012 (MetadataRepository)
            │               └── US-013 (MetadataService)
            │                       ├── US-015 (MetadataRouter)
            │                       └── US-016 (CREATE TABLE)
            │                               └── US-017 (ALTER TABLE)
            └── US-014 (DTOs)
                    └── US-015 (MetadataRouter)
```

---

## Tickets Relacionados

- TK-BE-011: Crear entidades dominio metadatos
- TK-DBA-004: Crear modelos/migraciones metadatos
- TK-BE-012: Implementar MetadataRepository
- TK-BE-013: Implementar MetadataService
- TK-BE-014: Crear DTOs metadatos
- TK-BE-015: Implementar TableManager DDL
- TK-BE-016: Crear MetadataRouter
