# Sistema Low-Code Platform

## Descripción

Sistema administrativo basado en metadatos que permite definir entidades de negocio dinámicamente y gestionar registros a través de interfaces generadas automáticamente.

## Características Principales

- ✅ Definición dinámica de entidades, campos, relaciones y vistas
- ✅ CRUD genérico para cualquier entidad configurada
- ✅ Sistema de auditoría completo con bitácoras
- ✅ Mecanismo de rollback para revertir cambios
- ✅ Reportes y métricas del sistema
- ✅ Autenticación y autorización con Keycloak
- ✅ Arquitectura extensible y mantenible

## Stack Tecnológico

### Backend
- **Python 3.12** con **FastAPI**
- **SQLAlchemy** (ORM para metadatos + Core para queries dinámicas)
- **PostgreSQL** como base de datos
- **Alembic** para migraciones
- **Pydantic** para validación de datos

### Frontend
- **React** con TypeScript
- **Tailwind CSS** para estilos
- **Vite** como build tool

### Autenticación
- **Keycloak** para autenticación y autorización (o JWT simple para MVP)

## Estructura del Proyecto

```
Proyecto/
├── Basic.md                    # Documentación completa de diseño
├── Database/
│   └── schema.sql              # Esquema de base de datos
├── Diagrams/
│   └── detailed-diagrams.md    # Diagramas adicionales
└── Examples/
    └── code-examples.md        # Ejemplos de código
```

## Documentación

La documentación completa del diseño del sistema se encuentra en **[Basic.md](./Basic.md)**, que incluye:

1. Validación y resumen del problema
2. Propuesta de arquitectura general
3. Diagramas a gran escala
4. Diagramas específicos de flujo
5. Diseño de base de datos
6. Diseño de API backend
7. Diseño de frontend
8. Plan de implementación por fases
9. Estrategia de pruebas
10. Aspectos adicionales (seguridad, logging, etc.)

## Inicio Rápido

### Prerrequisitos

- Python 3.12
- Node.js 18+
- PostgreSQL 14+
- Keycloak (puede ejecutarse con Docker, opcional para MVP)

### Configuración

1. Clonar el repositorio
2. Crear entorno virtual de Python: `python -m venv venv`
3. Activar entorno virtual: `source venv/bin/activate` (Linux/Mac) o `venv\Scripts\activate` (Windows)
4. Instalar dependencias: `pip install -r requirements.txt`
5. Configurar base de datos PostgreSQL
6. Configurar variables de entorno (`.env`)
7. Ejecutar migraciones: `alembic upgrade head`
8. Iniciar backend: `uvicorn app.main:app --reload`
9. Iniciar frontend: `cd frontend && npm install && npm run dev`

## Plan de Implementación

El proyecto se implementará en 9 fases:

1. **Fase 1**: Setup del proyecto e integración con Keycloak
2. **Fase 2**: Modelo y API de metadatos
3. **Fase 3**: CRUD genérico backend
4. **Fase 4**: Frontend para administración de metadatos
5. **Fase 5**: Frontend para CRUD genérico
6. **Fase 6**: Auditoría, bitácoras y reportes
7. **Fase 7**: Mecanismo de rollback
8. **Fase 8**: Pruebas unitarias e integrales
9. **Fase 9**: Mejoras de calidad y documentación

Ver detalles completos en [Basic.md](./Basic.md#8-plan-de-implementación-por-fases).

## Licencia

Este proyecto es parte de un curso académico.

