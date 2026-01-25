# 🛠️ MetaBuilder - Stack Tecnológico

> **Última actualización**: 24 de Enero 2026

## Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Python | 3.12 | Lenguaje principal |
| FastAPI | latest | Framework web REST |
| SQLAlchemy | latest | ORM para metadatos + Core para queries dinámicas |
| Alembic | latest | Migraciones de base de datos |
| Pydantic | latest | Validación de datos y DTOs |
| PyJWT | latest | Manejo de tokens JWT |
| Passlib | latest | Hash de contraseñas (bcrypt) |
| Uvicorn | latest | Servidor ASGI |

### Estructura Backend Propuesta
```
backend/
├── app/
│   ├── api/
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── metadata.py
│   │       └── crud.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── domain/
│   │   └── entities/
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── metadata_service.py
│   │   └── crud_service.py
│   ├── infrastructure/
│   │   ├── database.py
│   │   ├── repositories/
│   │   └── table_manager.py
│   └── main.py
├── alembic/
├── tests/
├── requirements.txt
└── Dockerfile
```

## Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18 | Framework UI |
| TypeScript | latest | Tipado estático |
| Vite | latest | Build tool y dev server |
| TailwindCSS | latest | Framework de estilos |
| Axios | latest | Cliente HTTP |
| React Router | v6 | Routing SPA |

### Estructura Frontend Propuesta
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── entities/
│   │   └── crud/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDynamicEntity.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Entities.tsx
│   │   └── DynamicCrud.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── crud.service.ts
│   ├── types/
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
    ports: 3000:3000
```

## Dependencias Clave por Instalar

### Backend (requirements.txt)
```
fastapi>=0.100.0
uvicorn[standard]>=0.22.0
sqlalchemy>=2.0.0
alembic>=1.11.0
psycopg2-binary>=2.9.6
pydantic>=2.0.0
pydantic-settings>=2.0.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "@types/react": "^18.2.0"
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
VITE_API_URL=http://localhost:8000/api
```

---

> **Actualizar este archivo cuando**: Se agreguen nuevas dependencias, cambien versiones significativas, o se modifique la estructura de carpetas.
