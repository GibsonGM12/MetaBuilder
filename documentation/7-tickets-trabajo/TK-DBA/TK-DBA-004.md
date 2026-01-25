# TK-DBA-004: Crear modelos y migraciones para metadatos

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-004 |
| **Tipo** | Database |
| **Historia** | US-011 |
| **Título** | Crear modelos SQLAlchemy para entities y entity_fields |
| **Responsable** | DBA |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-DBA-003, TK-BE-011 |

## Descripción Técnica

Crear modelos SQLAlchemy y migración para tablas de metadatos.

## Checklist de Implementación

- [ ] Agregar EntityModel en `models.py`
- [ ] Agregar EntityFieldModel en `models.py`
- [ ] Configurar relación 1-N con cascade delete
- [ ] Configurar constraints UNIQUE
- [ ] Generar migración: `alembic revision --autogenerate -m "create_metadata_tables"`
- [ ] Aplicar migración

## Definición de Terminado (DoD)

- [ ] Tablas entities y entity_fields existen
- [ ] Relación FK configurada
- [ ] Cascade delete funciona
