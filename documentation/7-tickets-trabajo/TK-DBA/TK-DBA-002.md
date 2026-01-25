# TK-DBA-002: Inicializar Alembic para migraciones

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-002 |
| **Tipo** | Database |
| **Historia** | US-004 |
| **Título** | Inicializar y configurar Alembic |
| **Responsable** | DBA |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-DBA-001 |

## Descripción Técnica

Configurar Alembic para gestión de migraciones de base de datos.

## Checklist de Implementación

- [ ] Ejecutar `alembic init alembic` en directorio backend
- [ ] Configurar `alembic/env.py` con conexión desde settings
- [ ] Configurar `alembic.ini` con connection string
- [ ] Importar Base y modelos en env.py
- [ ] Probar `alembic revision --autogenerate -m "test"`
- [ ] Eliminar migración de prueba

## Definición de Terminado (DoD)

- [ ] `alembic revision --autogenerate` funciona
- [ ] `alembic upgrade head` ejecuta sin errores
- [ ] Connection string viene de variable de entorno
