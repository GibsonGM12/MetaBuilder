# 🎯 MetaBuilder - Contexto Activo

> **Última actualización**: 5 de Marzo 2026

## Estado Actual de la Sesión

### Trabajo en Curso

| Campo | Valor |
|-------|-------|
| **Épica activa** | ÉPICA 07 - Deploy y Documentación |
| **Ticket actual** | TK-DBA-005 - Crear script de seeds |
| **Archivos modificados** | Ver sección "Archivos Creados/Modificados" |
| **Bloqueadores** | Ninguno |

### Sesión Completada - CRUD Dinámico

Se completaron las Épicas 04 (Motor CRUD Dinámico Backend) y 06 (Frontend CRUD Dinámico):

- **Backend**: DTOs, DynamicDataRepository (SQLAlchemy Core), DataValidator, DynamicCrudService, CrudRouter (5 endpoints REST)
- **Frontend**: crudService.ts, useCrud.ts hooks, DynamicList, DynamicForm, EntityRecords page
- **Navegación**: Item "Datos" en sidebar para todos los usuarios, ruta /records
- **Tests**: 74 tests pasando (39 nuevos para CRUD dinámico)

### Sesión Completada - CI/CD Pipeline

Se configuró el pipeline de CI/CD con GitHub Actions:

- **Build en GitHub Runners** (ubuntu-latest): Compilación del frontend (Vite) y build de la imagen Docker del backend en paralelo
- **Deploy en Self-hosted** (VMTest): Frontend a `/var/www/html/metabuilder`, backend via Docker Compose en `/opt/metabuilder`
- **Archivos creados**: `.github/workflows/deploy.yml`, `app/docker-compose.prod.yml`, `app/.env.prod.example`
- **Enfoque**: Docker save/load via artifacts (sin GHCR)
- **Trigger**: En cada PR hacia `main` que modifique archivos en `app/`

### Próxima Tarea

**Ticket**: TK-DBA-005 - Crear script de seeds

**Descripción**: Crear datos iniciales para la base de datos de producción.

---

## Contexto Técnico Relevante

### Decisiones Tomadas

- **CI/CD sin GHCR**: Pipeline usa Docker save/load via GitHub Actions artifacts en vez de Container Registry
- **Deploy self-hosted**: Build en runners de GitHub, solo deploy en VMTest (self-hosted)
- **bcrypt directo**: Uso de bcrypt directamente en lugar de passlib para hashing de contraseñas
- **PostgreSQL async/sync**: asyncpg para operaciones asíncronas en runtime; psycopg2-binary para Alembic (migraciones síncronas)
- **Error handling**: ErrorHandlerMiddleware reemplazado por exception handlers registrados en la app FastAPI
- **SQLAlchemy Core para CRUD dinámico**: DynamicDataRepository usa `text()` para DML sobre tablas dinámicas (INSERT, SELECT, UPDATE, DELETE)
- **Conversión de tipos en validator**: Fechas se convierten a `datetime.date` antes de insertar; Decimals se convierten a float en las respuestas
- **CRUD accesible para todos**: Los endpoints de registros requieren `get_current_user` (no solo admin)

### Problemas Encontrados y Resueltos

- **asyncpg requiere `datetime.date`**: Las fechas ISO string deben convertirse a objetos `date` antes de pasar a asyncpg
- **Decimal serialización**: Los valores `Decimal` de PostgreSQL se convierten a `float` en `_build_response`
- **SQLAlchemy ORM en unit tests**: No se puede usar `__new__` con modelos SQLAlchemy; se usa `MagicMock` con `spec`

### Notas de Implementación

- 74 tests pasando: 35 originales + 39 nuevos para CRUD dinámico
- Backend y frontend funcionales con Auth, Metadatos, CRUD dinámico completo
- Siguiente paso: Deploy y documentación

---

## Archivos Creados/Modificados

### Backend - Vertical Slice 1
- `app/backend/app/main.py` - Punto de entrada FastAPI
- `app/backend/app/core/config.py` - Configuración
- `app/backend/app/core/database.py` - Conexión DB
- `app/backend/app/domain/entities.py` - Entidades User, Entity, EntityField
- `app/backend/app/domain/interfaces.py` - Interfaces de repositorios
- `app/backend/app/infrastructure/database/models.py` - Modelos SQLAlchemy
- `app/backend/app/infrastructure/database/repositories/metadata_repository.py`
- `app/backend/app/infrastructure/database/table_manager.py`
- `app/backend/app/application/services/auth_service.py`
- `app/backend/app/application/services/metadata_service.py`
- `app/backend/app/application/dto/auth_dto.py`
- `app/backend/app/application/dto/metadata_dto.py`
- `app/backend/app/api/routers/auth.py`
- `app/backend/app/api/routers/metadata.py`
- `app/backend/app/api/routers/health.py`
- `app/backend/app/api/deps.py`
- `app/backend/app/api/middleware/error_handler.py`
- `app/backend/alembic/` - Migraciones
- `app/backend/requirements.txt`
- `app/backend/Dockerfile`
- `app/backend/tests/` - test_auth, test_metadata, test_health, test_table_manager_unit, test_metadata_service_unit

### Backend - CRUD Dinámico (nuevo)
- `app/backend/app/application/dto/crud_dto.py` - DTOs para CRUD dinámico
- `app/backend/app/infrastructure/database/repositories/dynamic_data_repository.py` - Repository con SQLAlchemy Core
- `app/backend/app/application/services/data_validator.py` - Validación dinámica de registros
- `app/backend/app/application/services/crud_service.py` - DynamicCrudService
- `app/backend/app/api/routers/crud.py` - 5 endpoints REST
- `app/backend/tests/test_data_validator_unit.py` - 15 unit tests
- `app/backend/tests/test_crud_service_unit.py` - 9 unit tests
- `app/backend/tests/test_crud.py` - 14 integration tests

### Frontend - Vertical Slice 1
- `app/frontend/src/App.tsx`
- `app/frontend/src/main.tsx`
- `app/frontend/src/contexts/AuthContext.tsx`
- `app/frontend/src/hooks/useAuth.ts`
- `app/frontend/src/hooks/useMetadata.ts`
- `app/frontend/src/services/api.ts`
- `app/frontend/src/services/metadataService.ts`
- `app/frontend/src/pages/Login.tsx`
- `app/frontend/src/pages/Home.tsx`
- `app/frontend/src/pages/EntityManagement.tsx`
- `app/frontend/src/pages/EntityDetail.tsx`
- `app/frontend/src/components/layout/Layout.tsx`
- `app/frontend/src/components/admin/EntityBuilder.tsx`
- `app/frontend/src/components/admin/FieldManager.tsx`
- `app/frontend/src/components/common/Button.tsx`, `Input.tsx`, `Modal.tsx`
- `app/frontend/src/types/index.ts`

### Frontend - CRUD Dinámico (nuevo)
- `app/frontend/src/services/crudService.ts` - Servicio CRUD con Axios
- `app/frontend/src/hooks/useCrud.ts` - React Query hooks
- `app/frontend/src/components/crud/DynamicList.tsx` - Tabla dinámica
- `app/frontend/src/components/crud/DynamicForm.tsx` - Formulario dinámico
- `app/frontend/src/pages/EntityRecords.tsx` - Página principal de registros

### Infraestructura
- `app/docker-compose.yml`
- `app/docker-compose.prod.yml` - Compose de producción (imagen local, sin --reload, sin volumes dev)
- `app/.env.example`
- `app/.env.prod.example` - Variables de producción

### CI/CD
- `.github/workflows/deploy.yml` - Pipeline: build-frontend + build-backend + deploy

---

## Estructura de Carpetas Actual

```
MetaBuilder/
├── .cursor/
│   └── rules/           # Memory Bank
├── app/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── api/           # Routers, middleware, deps
│   │   │   ├── application/   # Services, DTOs
│   │   │   ├── core/          # Config, database
│   │   │   ├── domain/        # Entities, interfaces
│   │   │   ├── infrastructure/# Models, repositories, table_manager
│   │   │   └── main.py
│   │   ├── alembic/
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── package.json
│   ├── docker-compose.yml
│   └── .env.example
├── Database/
├── Diagrams/
├── documentation/
├── Examples/
├── Prompts/
├── Project.md
├── README.md
└── funcionalidad_core.md
```

---

## Comandos Útiles

### Docker
```bash
cd app
docker-compose up -d
```

### Backend
```bash
cd app/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
pytest
```

### Frontend
```bash
cd app/frontend
npm install
npm run dev
```

---

## Checklist de Inicio de Sesión

- [ ] Leer `progress.md` para ver estado actual
- [ ] Identificar ticket a trabajar (TK-DBA-005)
- [ ] Revisar documentación del ticket en `documentation/7-tickets-trabajo/`
- [ ] Implementar ticket
- [ ] Actualizar `progress.md` al completar
- [ ] Actualizar este archivo con contexto relevante

---

> **Actualizar este archivo cuando**: Se inicie una nueva tarea, se encuentren problemas, se tomen decisiones técnicas, o se complete una sesión de trabajo.
