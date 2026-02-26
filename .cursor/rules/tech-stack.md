# 🛠️ MetaBuilder - Stack Tecnológico

> **Última actualización**: 26 de Febrero 2026

## Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Python | 3.12 | Lenguaje principal |
| FastAPI | >=0.115.0 | Framework web REST |
| SQLAlchemy | >=2.0.0 (asyncio) | ORM para metadatos + Core para queries dinámicas |
| asyncpg | >=0.30.0 | Driver PostgreSQL async |
| psycopg2-binary | >=2.9.0 | Driver PostgreSQL sync (Alembic) |
| Alembic | >=1.14.0 | Migraciones de base de datos |
| Pydantic | >=2.0.0 | Validación de datos y DTOs |
| python-jose | >=3.3.0 | Manejo de tokens JWT (jose) |
| bcrypt | (via passlib) | Hash de contraseñas (uso directo de bcrypt) |
| Uvicorn | >=0.34.0 | Servidor ASGI |
| pytest / pytest-asyncio | >=8.0.0 / >=0.24.0 | Testing |
| ruff | >=0.9.0 | Linter |

### Estructura Backend Actual
```
backend/
├── app/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── health.py
│   │   │   ├── metadata.py
│   │   │   └── crud.py
│   │   ├── middleware/
│   │   │   └── error_handler.py
│   │   └── deps.py
│   ├── application/
│   │   ├── dto/
│   │   │   ├── auth_dto.py
│   │   │   ├── metadata_dto.py
│   │   │   └── crud_dto.py
│   │   └── services/
│   │       ├── auth_service.py
│   │       ├── metadata_service.py
│   │       ├── crud_service.py
│   │       └── data_validator.py
│   ├── core/
│   │   ├── config.py
│   │   └── database.py
│   ├── domain/
│   │   ├── entities.py
│   │   └── interfaces.py
│   ├── infrastructure/
│   │   └── database/
│   │       ├── models.py
│   │       ├── repositories/
│   │       │   ├── metadata_repository.py
│   │       │   └── dynamic_data_repository.py
│   │       └── table_manager.py
│   └── main.py
├── alembic/
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_health.py
│   ├── test_metadata.py
│   ├── test_crud.py
│   ├── test_metadata_service_unit.py
│   ├── test_crud_service_unit.py
│   ├── test_data_validator_unit.py
│   └── test_table_manager_unit.py
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

## Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^18.3.1 | Framework UI |
| TypeScript | ~5.6.0 | Tipado estático |
| Vite | ^6.0.0 | Build tool y dev server |
| TailwindCSS | ^3.4.0 | Framework de estilos |
| Axios | ^1.7.9 | Cliente HTTP |
| React Router | ^6.28.0 | Routing SPA |
| TanStack React Query | ^5.62.0 | Data fetching y cache |

### Estructura Frontend Actual
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   └── Layout.tsx
│   │   ├── admin/
│   │   │   ├── EntityBuilder.tsx
│   │   │   └── FieldManager.tsx
│   │   └── crud/
│   │       ├── DynamicList.tsx
│   │       └── DynamicForm.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMetadata.ts
│   │   └── useCrud.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── EntityManagement.tsx
│   │   ├── EntityDetail.tsx
│   │   └── EntityRecords.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── metadataService.ts
│   │   └── crudService.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── package.json
└── vite.config.ts
```

## Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| PostgreSQL | 15+ | Base de datos principal |

## DevOps / Infraestructura

| Tecnología | Propósito |
|------------|-----------|
| Docker | Containerización |
| Docker Compose | Orquestación local |
| GitHub Actions | CI/CD básico |
| Railway/Render | Deploy (opción principal) |
| Azure App Service | Deploy (opción alternativa) |

### Docker Compose Local
```yaml
services:
  db:
    image: postgres:15
    ports: 5432:5432
  backend:
    build: ./backend
    ports: 8000:8000
  frontend:
    build: ./frontend
    ports: 5173:5173
```

## Dependencias Instaladas

### Backend (requirements.txt)
```
fastapi>=0.115.0
uvicorn[standard]>=0.34.0
sqlalchemy[asyncio]>=2.0.0
asyncpg>=0.30.0
psycopg2-binary>=2.9.0
alembic>=1.14.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.18
httpx>=0.28.0
pytest>=8.0.0
pytest-asyncio>=0.24.0
ruff>=0.9.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "axios": "^1.7.9",
    "@tanstack/react-query": "^5.62.0"
  },
  "devDependencies": {
    "typescript": "~5.6.0",
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.3.12"
  }
}
```

## Variables de Entorno

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/metabuilder
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
DEBUG=true
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

> **Actualizar este archivo cuando**: Se agreguen nuevas dependencias, cambien versiones significativas, o se modifique la estructura de carpetas.
