# MetaBuilder

Plataforma low-code basada en metadatos para definir entidades dinámicamente, generar tablas en PostgreSQL y realizar CRUD a través de interfaces generadas automáticamente.

## Requisitos

- Docker y Docker Compose
- (Opcional) Node.js 22+ y Python 3.12+ para desarrollo local sin Docker

## Setup rápido

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Levantar todos los servicios
docker compose up --build

# 3. Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

## Comandos útiles

```bash
# Levantar en background
docker compose up -d --build

# Ver logs
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar un servicio
docker compose restart backend

# Detener todo
docker compose down

# Detener y eliminar volúmenes (reset DB)
docker compose down -v

# Ejecutar tests backend
docker compose exec backend pytest

# Ejecutar migraciones
docker compose exec backend alembic upgrade head
```

## Estructura del proyecto

```
app/
├── docker-compose.yml
├── backend/
│   ├── app/           # Código fuente FastAPI
│   ├── alembic/       # Migraciones de BD
│   ├── tests/         # Tests
│   └── Dockerfile
├── frontend/
│   ├── src/           # Código fuente React
│   └── Dockerfile
└── docs/              # Documentación adicional
```

## Stack tecnológico

- **Backend:** FastAPI + SQLAlchemy 2.0 (async) + PostgreSQL 15
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Infraestructura:** Docker Compose
