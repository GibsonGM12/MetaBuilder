# TK-INFRA-001: Crear docker-compose.yml con PostgreSQL

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-001 |
| **Tipo** | Infraestructura |
| **Historia** | US-002 |
| **Título** | Configurar Docker Compose con PostgreSQL |
| **Responsable** | DevOps |
| **Estimación** | S (10 min) |
| **Dependencias** | Ninguna |

## Descripción Técnica

Crear archivo docker-compose.yml para levantar PostgreSQL 15 con persistencia.

## Checklist de Implementación

- [ ] Crear `docker-compose.yml` en raíz del proyecto
- [ ] Configurar servicio postgres con imagen `postgres:15-alpine`
- [ ] Configurar variables de entorno (DB, USER, PASSWORD)
- [ ] Mapear puerto 5432
- [ ] Configurar volumen para persistencia
- [ ] Probar con `docker-compose up -d postgres`

## Contenido Sugerido

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: metabuilder-db
    environment:
      POSTGRES_DB: metabuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Definición de Terminado (DoD)

- [ ] `docker-compose up -d postgres` levanta el contenedor
- [ ] Conexión exitosa en localhost:5432
- [ ] Datos persisten tras reinicio
