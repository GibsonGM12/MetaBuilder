# TK-DBA-006: Ejecutar migraciones en producción

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-006 |
| **Tipo** | Database |
| **Historia** | US-039 |
| **Título** | Aplicar migraciones y seeds en producción |
| **Responsable** | DBA |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-DBA-005, TK-INFRA-004 |

## Checklist de Implementación

- [ ] Conectar a BD de Railway
- [ ] Ejecutar alembic upgrade head
- [ ] Ejecutar seeds
- [ ] Verificar datos

## Definición de Terminado (DoD)

- [ ] Migraciones aplicadas en producción
- [ ] Datos de demo disponibles
- [ ] Sistema funcional
