# Arquitectura del Sistema - MetaBuilder

## 1. Diagrama de Arquitectura

### 1.1 Diagrama C4 - Nivel 1: Contexto

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONTEXTO DEL SISTEMA                            │
│                                                                              │
│   ┌─────────────────┐                          ┌─────────────────┐          │
│   │  Administrador  │                          │  Usuario Final  │          │
│   │   (Persona)     │                          │    (Persona)    │          │
│   │                 │                          │                 │          │
│   │ Define entidades│                          │ Gestiona datos  │          │
│   │ y estructura    │                          │ de entidades    │          │
│   └────────┬────────┘                          └────────┬────────┘          │
│            │                                            │                    │
│            │  HTTPS                              HTTPS  │                    │
│            │                                            │                    │
│            └──────────────────┬─────────────────────────┘                    │
│                               │                                              │
│                               ▼                                              │
│                    ┌─────────────────────┐                                   │
│                    │     MetaBuilder     │                                   │
│                    │  (Sistema Software) │                                   │
│                    │                     │                                   │
│                    │ Plataforma low-code │                                   │
│                    │ basada en metadatos │                                   │
│                    └─────────────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Diagrama C4 - Nivel 2: Contenedores

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONTENEDORES DEL SISTEMA                           │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND CONTAINER                            │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │  Single Page Application (SPA)                                  │  │   │
│  │  │  React 18 + TypeScript + Vite + TailwindCSS                    │  │   │
│  │  │                                                                 │  │   │
│  │  │  Responsabilidades:                                             │  │   │
│  │  │  - Renderizar UI dinámica según metadatos                      │  │   │
│  │  │  - Gestionar autenticación en cliente                          │  │   │
│  │  │  - Validaciones de formularios                                 │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   │ HTTP/REST + JWT                          │
│                                   │                                          │
│  ┌────────────────────────────────▼─────────────────────────────────────┐   │
│  │                         BACKEND CONTAINER                             │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │  API Application                                                │  │   │
│  │  │  Python 3.12 + FastAPI                                         │  │   │
│  │  │                                                                 │  │   │
│  │  │  Responsabilidades:                                             │  │   │
│  │  │  - Exponer APIs REST                                           │  │   │
│  │  │  - Autenticación y autorización JWT                            │  │   │
│  │  │  - Lógica de negocio                                           │  │   │
│  │  │  - Queries dinámicas sobre metadatos                           │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   │ SQL (psycopg2)                           │
│                                   │                                          │
│  ┌────────────────────────────────▼─────────────────────────────────────┐   │
│  │                        DATABASE CONTAINER                             │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │  PostgreSQL 15+                                                 │  │   │
│  │  │                                                                 │  │   │
│  │  │  Almacena:                                                      │  │   │
│  │  │  - Tablas de metadatos (entities, entity_fields, users)        │  │   │
│  │  │  - Tablas dinámicas (entity_{uuid}) con datos de negocio       │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Diagrama C4 - Nivel 3: Componentes (Backend)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENTES DEL BACKEND (Clean Architecture)            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  API LAYER (Presentación)                                             │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │  AuthRouter     │ │ MetadataRouter  │ │  CrudRouter     │        │   │
│  │  │  /api/auth/*    │ │ /api/metadata/* │ │ /api/entities/* │        │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘        │   │
│  │           │                   │                   │                  │   │
│  │  ┌────────┴───────────────────┴───────────────────┴────────┐        │   │
│  │  │              JWT Middleware + Error Handler              │        │   │
│  │  └──────────────────────────┬───────────────────────────────┘        │   │
│  └─────────────────────────────┼────────────────────────────────────────┘   │
│                                │                                             │
│  ┌─────────────────────────────▼────────────────────────────────────────┐   │
│  │  APPLICATION LAYER (Casos de Uso)                                     │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │  AuthService    │ │ MetadataService │ │DynamicCrudService│       │   │
│  │  │                 │ │                 │ │                 │        │   │
│  │  │ - register()    │ │ - createEntity()│ │ - getRecords()  │        │   │
│  │  │ - login()       │ │ - addField()    │ │ - createRecord()│        │   │
│  │  │ - validateToken │ │ - deleteEntity()│ │ - updateRecord()│        │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘        │   │
│  │           │                   │                   │                  │   │
│  │  ┌────────┴───────────────────┴───────────────────┴────────┐        │   │
│  │  │  QueryBuilder          DataValidator          DTOs       │        │   │
│  │  └──────────────────────────┬───────────────────────────────┘        │   │
│  └─────────────────────────────┼────────────────────────────────────────┘   │
│                                │                                             │
│  ┌─────────────────────────────▼────────────────────────────────────────┐   │
│  │  DOMAIN LAYER (Entidades y Contratos)                                 │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │  Entity         │ │  EntityField    │ │  User           │        │   │
│  │  │  (Domain Model) │ │  (Domain Model) │ │  (Domain Model) │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  │                                                                       │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │IMetadataRepo    │ │IDynamicDataRepo │ │ ITableManager   │        │   │
│  │  │  (Interface)    │ │   (Interface)   │ │   (Interface)   │        │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘        │   │
│  └───────────┼───────────────────┼───────────────────┼──────────────────┘   │
│              │                   │                   │                       │
│  ┌───────────▼───────────────────▼───────────────────▼──────────────────┐   │
│  │  INFRASTRUCTURE LAYER (Implementaciones)                              │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │MetadataRepository│DynamicDataRepo   │ │  TableManager   │        │   │
│  │  │(SQLAlchemy ORM) │ │(SQLAlchemy Core)│ │  (DDL dinámico) │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  │                                                                       │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │  JwtService     │ │PasswordHasher   │ │  Database       │        │   │
│  │  │  (PyJWT)        │ │   (bcrypt)      │ │  (Session)      │        │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Descripción de Componentes Principales

### 2.1 API Layer

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| **AuthRouter** | `api/routers/auth.py` | Endpoints de registro y login |
| **MetadataRouter** | `api/routers/metadata.py` | CRUD de entidades y campos |
| **CrudRouter** | `api/routers/crud.py` | CRUD dinámico de registros |
| **JwtMiddleware** | `api/middleware/auth.py` | Validación de tokens JWT |
| **ErrorHandler** | `api/middleware/error_handler.py` | Manejo global de excepciones |

### 2.2 Application Layer

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| **AuthService** | `application/services/auth_service.py` | Lógica de autenticación |
| **MetadataService** | `application/services/metadata_service.py` | Gestión de metadatos |
| **DynamicCrudService** | `application/services/crud_service.py` | Operaciones CRUD dinámicas |
| **QueryBuilder** | `application/services/query_builder.py` | Construcción de SQL dinámico |
| **DataValidator** | `application/services/data_validator.py` | Validación de datos |

### 2.3 Domain Layer

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| **Entity** | `domain/entities.py` | Modelo de entidad |
| **EntityField** | `domain/entities.py` | Modelo de campo |
| **User** | `domain/entities.py` | Modelo de usuario |
| **Interfaces** | `domain/interfaces.py` | Contratos de repositorios |

### 2.4 Infrastructure Layer

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| **MetadataRepository** | `infrastructure/database/repositories/metadata_repository.py` | Acceso a metadatos (ORM) |
| **DynamicDataRepository** | `infrastructure/database/repositories/dynamic_data_repository.py` | Acceso a datos dinámicos (Core) |
| **TableManager** | `infrastructure/database/table_manager.py` | DDL dinámico |
| **JwtService** | `infrastructure/security/jwt_service.py` | Generación/validación JWT |
| **Database** | `infrastructure/database/database.py` | Configuración SQLAlchemy |

---

## 3. Estructura de Ficheros

### 3.1 Backend

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # Punto de entrada FastAPI
│   │
│   ├── domain/                          # Capa de dominio
│   │   ├── __init__.py
│   │   ├── entities.py                  # Entity, EntityField, User
│   │   └── interfaces.py                # Protocols/Interfaces
│   │
│   ├── application/                     # Capa de aplicación
│   │   ├── __init__.py
│   │   ├── dto/
│   │   │   ├── __init__.py
│   │   │   ├── auth_dto.py
│   │   │   ├── metadata_dto.py
│   │   │   └── crud_dto.py
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── auth_service.py
│   │       ├── metadata_service.py
│   │       ├── crud_service.py
│   │       ├── query_builder.py
│   │       └── data_validator.py
│   │
│   ├── infrastructure/                  # Capa de infraestructura
│   │   ├── __init__.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── database.py              # Engine y Session
│   │   │   ├── models.py                # Modelos SQLAlchemy
│   │   │   ├── table_manager.py         # DDL dinámico
│   │   │   └── repositories/
│   │   │       ├── __init__.py
│   │   │       ├── metadata_repository.py
│   │   │       └── dynamic_data_repository.py
│   │   └── security/
│   │       ├── __init__.py
│   │       └── jwt_service.py
│   │
│   └── api/                             # Capa de presentación
│       ├── __init__.py
│       ├── dependencies.py              # Inyección de dependencias
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── metadata.py
│       │   └── crud.py
│       └── middleware/
│           ├── __init__.py
│           └── error_handler.py
│
├── alembic/                             # Migraciones
│   ├── versions/
│   └── env.py
│
├── tests/                               # Tests
│   ├── __init__.py
│   └── test_smoke.py
│
├── .env.example
├── requirements.txt
├── Dockerfile
└── README.md
```

### 3.2 Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── admin/
│   │   │   ├── EntityBuilder.tsx
│   │   │   └── FieldManager.tsx
│   │   ├── crud/
│   │   │   ├── DynamicList.tsx
│   │   │   ├── DynamicForm.tsx
│   │   │   └── DynamicTable.tsx
│   │   └── layout/
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   │
│   ├── services/
│   │   ├── api.ts                       # Axios instance
│   │   ├── authService.ts
│   │   ├── metadataService.ts
│   │   └── crudService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMetadata.ts
│   │   └── useDynamicEntity.ts
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── admin/
│   │   │   └── EntityManagement.tsx
│   │   └── entities/
│   │       ├── EntitySelector.tsx
│   │       └── RecordList.tsx
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── metadata.ts
│   │   └── crud.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

---

## 4. Decisiones de Arquitectura (ADRs)

### ADR-001: Clean Architecture con 4 Capas

**Contexto**: Necesitamos una arquitectura que permita mantener el código organizado y testeable.

**Decisión**: Implementar Clean Architecture con 4 capas (Domain, Application, Infrastructure, API).

**Consecuencias**:
- (+) Separación clara de responsabilidades
- (+) Facilita testing unitario
- (+) Permite cambiar implementaciones (ej: BD) sin afectar lógica
- (-) Más código inicial
- (-) Curva de aprendizaje

### ADR-002: SQLAlchemy ORM + Core

**Contexto**: Necesitamos acceder a tablas de metadatos (estructura conocida) y tablas dinámicas (estructura variable).

**Decisión**: Usar SQLAlchemy ORM para metadatos y SQLAlchemy Core para queries dinámicas.

**Consecuencias**:
- (+) ORM para código más limpio en metadatos
- (+) Core permite flexibilidad para SQL dinámico
- (+) Mismo driver y pool de conexiones
- (-) Dos patrones de acceso a datos

### ADR-003: Tablas Dinámicas por Entidad

**Contexto**: Necesitamos almacenar datos de entidades definidas por el usuario.

**Decisión**: Crear una tabla física por cada entidad (`entity_{uuid}`) en lugar de usar EAV (Entity-Attribute-Value).

**Alternativa descartada**: Tabla EAV genérica con columnas (entity_id, attribute_name, attribute_value).

**Consecuencias**:
- (+) Mejor rendimiento en queries
- (+) Permite índices específicos
- (+) SQL más simple y eficiente
- (-) Requiere DDL dinámico (CREATE TABLE, ALTER TABLE)
- (-) Más complejidad en gestión de schema

### ADR-004: JWT Simple sin Keycloak

**Contexto**: Necesitamos autenticación segura pero con tiempo limitado de implementación.

**Decisión**: Implementar JWT manualmente con PyJWT y bcrypt, sin usar Keycloak.

**Consecuencias**:
- (+) Implementación más simple
- (+) Sin dependencias externas
- (+) Control total del código
- (-) Menos features (no hay SSO, refresh tokens complejos, etc.)
- (-) Responsabilidad de seguridad recae en nosotros

### ADR-005: Hard Delete en MVP

**Contexto**: Necesitamos funcionalidad de eliminación pero con tiempo limitado.

**Decisión**: Implementar hard delete (eliminación física) en lugar de soft delete.

**Consecuencias**:
- (+) Implementación más simple
- (+) No requiere filtros adicionales en queries
- (-) No hay posibilidad de recuperar datos eliminados
- (-) No hay auditoría de eliminaciones (en MVP)

---

## 5. Integraciones Externas

### 5.1 Integraciones en MVP

| Sistema | Propósito | Tipo |
|---------|-----------|------|
| PostgreSQL | Base de datos | Requerida |
| Railway/Render | Hosting | Requerida |
| GitHub | Código y CI/CD | Requerida |

### 5.2 Integraciones Futuras (Post-MVP)

| Sistema | Propósito | Prioridad |
|---------|-----------|-----------|
| Keycloak | Auth avanzada con SSO | Media |
| Redis | Caché de metadatos | Baja |
| Elasticsearch | Búsqueda avanzada | Baja |
| S3/Azure Blob | Almacenamiento de archivos | Media |

---

## 6. Observabilidad

### 6.1 Logging

| Tipo | Herramienta | Destino |
|------|-------------|---------|
| Application logs | Python logging | stdout/stderr |
| Access logs | FastAPI middleware | stdout |
| Error logs | Exception handler | stdout + consola |

**Formato de logs**:
```
[TIMESTAMP] [LEVEL] [MODULE] - MESSAGE
2026-01-24 10:30:00 INFO api.auth - User admin logged in successfully
```

### 6.2 Métricas (Futuro)

| Métrica | Descripción |
|---------|-------------|
| request_count | Total de requests por endpoint |
| request_duration | Latencia por endpoint |
| error_rate | Porcentaje de errores |
| active_users | Usuarios activos |

### 6.3 Documentación API

- **Herramienta**: Swagger UI (auto-generado por FastAPI)
- **URL**: `/docs`
- **Alternativa**: ReDoc en `/redoc`

---

## 7. Seguridad

### 7.1 Autenticación

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Login   │─────▶│  Validar │─────▶│  Generar │─────▶│  Retornar│
│  Request │      │  Creds   │      │   JWT    │      │   Token  │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
                        │
                        ▼
                  ┌──────────┐
                  │  bcrypt  │
                  │  verify  │
                  └──────────┘
```

**Configuración JWT**:
- Algoritmo: HS256
- Expiración: 24 horas
- Claims: user_id, username, role, exp, iat

### 7.2 Autorización

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  Request │─────▶│  Extraer │─────▶│  Validar │─────▶│  Verificar│
│  con JWT │      │  Token   │      │   JWT    │      │   Rol    │
└──────────┘      └──────────┘      └──────────┘      └────┬─────┘
                                                           │
                                    ┌──────────────────────┼──────────────────────┐
                                    │                      │                      │
                                    ▼                      ▼                      ▼
                              ┌──────────┐          ┌──────────┐          ┌──────────┐
                              │  Admin   │          │   User   │          │  Rechazar│
                              │  Access  │          │  Access  │          │   403    │
                              └──────────┘          └──────────┘          └──────────┘
```

### 7.3 Prevención de SQL Injection

**Correcto** (con parámetros):
```python
# SQLAlchemy Core con parámetros
query = text("SELECT * FROM :table WHERE id = :id")
result = conn.execute(query, {"table": table_name, "id": record_id})
```

**Incorrecto** (concatenación):
```python
# NUNCA hacer esto
query = f"SELECT * FROM {table_name} WHERE id = '{record_id}'"
```

### 7.4 Manejo de Secretos

| Secreto | Almacenamiento | Rotación |
|---------|----------------|----------|
| JWT_SECRET_KEY | Variable de entorno | Manual |
| DATABASE_URL | Variable de entorno | Manual |
| Passwords | Hash bcrypt en BD | Por usuario |

---

## 8. Escalabilidad y Resiliencia

### 8.1 Consideraciones de Escalabilidad

| Aspecto | MVP | Futuro |
|---------|-----|--------|
| **Horizontal scaling** | Single instance | Multiple instances + Load Balancer |
| **Database** | Single PostgreSQL | Read replicas |
| **Caching** | Sin cache | Redis para metadatos |
| **CDN** | Sin CDN | CloudFlare para frontend |

### 8.2 Resiliencia

| Mecanismo | Implementación |
|-----------|----------------|
| **Health checks** | Endpoint `/health` |
| **Restart automático** | Docker restart policy |
| **Timeouts** | Configuración en Axios y SQLAlchemy |
| **Circuit breaker** | No implementado en MVP |

### 8.3 Límites y Throttling

| Recurso | Límite sugerido |
|---------|-----------------|
| Registros por página | 100 máximo |
| Campos por entidad | 50 máximo |
| Entidades por sistema | Sin límite |
| Requests por minuto | Sin límite (MVP) |

---

## 9. Entornos

### 9.1 Matriz de Entornos

| Entorno | URL Backend | URL Frontend | Base de datos |
|---------|-------------|--------------|---------------|
| **Development** | localhost:8000 | localhost:5173 | localhost:5432 |
| **Production** | api.metabuilder.railway.app | metabuilder.vercel.app | Railway PostgreSQL |

### 9.2 Variables de Entorno por Ambiente

#### Development
```env
ENVIRONMENT=development
DEBUG=true
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metabuilder
JWT_SECRET_KEY=dev-secret-key
CORS_ORIGINS=http://localhost:5173
```

#### Production
```env
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://user:pass@host:5432/metabuilder
JWT_SECRET_KEY=production-secret-key-very-long-and-secure
CORS_ORIGINS=https://metabuilder.vercel.app
```

### 9.3 Configuración Docker

**docker-compose.yml** (Development):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: metabuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/metabuilder
      JWT_SECRET_KEY: dev-secret-key
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:8000/api

volumes:
  postgres_data:
```

---

## 10. Diagramas de Flujo Detallados

### 10.1 Flujo de Creación de Entidad

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant API
    participant MetadataService
    participant MetadataRepo
    participant TableManager
    participant Database

    Admin->>Frontend: Completa formulario de entidad
    Frontend->>API: POST /api/metadata/entities
    API->>API: Validar JWT (Admin)
    API->>MetadataService: create_entity(dto)
    MetadataService->>MetadataService: Validar nombre único
    MetadataService->>MetadataService: Generar table_name
    MetadataService->>MetadataRepo: save(entity)
    MetadataRepo->>Database: INSERT INTO entities
    Database-->>MetadataRepo: entity_id
    MetadataService->>TableManager: create_table(entity)
    TableManager->>Database: CREATE TABLE entity_{uuid}
    Database-->>TableManager: OK
    MetadataService-->>API: Entity created
    API-->>Frontend: 201 + entity JSON
    Frontend-->>Admin: Redirigir a gestión de campos
```

### 10.2 Flujo de CRUD Dinámico

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant CrudService
    participant MetadataRepo
    participant QueryBuilder
    participant DynamicDataRepo
    participant Database

    User->>Frontend: Crear nuevo registro
    Frontend->>API: POST /api/entities/{id}/records
    API->>API: Validar JWT
    API->>CrudService: create_record(entity_id, data)
    CrudService->>MetadataRepo: get_entity(entity_id)
    MetadataRepo->>Database: SELECT entity + fields
    Database-->>MetadataRepo: Entity con campos
    MetadataRepo-->>CrudService: Entity
    CrudService->>CrudService: Validar datos vs campos
    CrudService->>QueryBuilder: build_insert(entity, data)
    QueryBuilder-->>CrudService: SQL + params
    CrudService->>DynamicDataRepo: execute(sql, params)
    DynamicDataRepo->>Database: INSERT INTO entity_{uuid}
    Database-->>DynamicDataRepo: record_id
    DynamicDataRepo-->>CrudService: record_id
    CrudService-->>API: Record created
    API-->>Frontend: 201 + record JSON
    Frontend-->>User: Mostrar en listado
```

---

*Última actualización: Enero 2026*
