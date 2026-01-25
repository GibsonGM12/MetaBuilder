# EP-07: Deploy y Documentación

**Objetivo**: Deploy en producción y documentación completa.  
**Tiempo estimado**: 2 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-038](US-038.md) | Crear Dockerfile para backend | P0 | 20 min | US-023 |
| [US-039](US-039.md) | Configurar deploy en Railway | P0 | 45 min | US-038 |
| [US-040](US-040.md) | Crear datos de demostración | P0 | 25 min | US-039 |
| [US-041](US-041.md) | Crear README completo | P0 | 30 min | US-039 |

---

## Flujo de Dependencias

```
US-023 (CrudRouter)
    └── US-038 (Dockerfile)
            └── US-039 (Deploy Railway)
                    ├── US-040 (Datos Demo)
                    └── US-041 (README)
```

---

## Tickets Relacionados

- TK-INFRA-003: Crear Dockerfile backend
- TK-INFRA-004: Configurar deploy en Railway
- TK-DBA-005: Crear script de seeds
- TK-DBA-006: Ejecutar migraciones en producción
- TK-QA-001: Pruebas de humo API
- TK-QA-002: Pruebas frontend producción
- TK-QA-003: Documentar bugs encontrados
