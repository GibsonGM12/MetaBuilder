# Funcionalidad CORE - MVP Sistema Low-Code Platform
## Proyecto de Curso - 30 Horas

---

## 🎯 Objetivo del MVP

Crear una **plataforma administrativa basada en metadatos** que permita:
1. Definir entidades dinámicamente (sin modificar código)
2. Realizar operaciones CRUD sobre esas entidades
3. Generar interfaces automáticas para gestionar los datos

**Premisa clave:** Sistema funcional end-to-end sobre arquitectura perfecta.

---

## 📦 Stack Tecnológico

### Backend
- **Framework:** FastAPI (Python 3.12)
- **Arquitectura:** Clean Architecture (4 capas)
- **ORM:** SQLAlchemy (ORM para metadatos + Core para queries dinámicas)
- **Base de Datos:** PostgreSQL 15+
- **Migraciones:** Alembic
- **Validación:** Pydantic
- **Autenticación:** JWT simple (sin Keycloak)

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Estilos:** TailwindCSS
- **HTTP Client:** Axios
- **Routing:** React Router v6

### DevOps
- **Contenedores:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (básico)
- **Deploy:** Railway, Render, o Azure App Service
- **Control de versiones:** Git + GitHub

---

## 🏗️ Arquitectura Simplificada

```
┌─────────────────────────────────────────┐
│         Frontend (React + TS)           │
│  - Admin de entidades                   │
│  - CRUD dinámico                        │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST + JWT
┌─────────────────▼───────────────────────┐
│      API Layer (Routers)                │
│  - metadata_router                      │
│  - crud_router                          │
│  - auth_router                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Application Layer (Services)         │
│  - MetadataService                      │
│  - DynamicCrudService                   │
│  - AuthService (JWT)                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Domain Layer (Entities)            │
│  - Entity, Field, ValidationRule        │
│  - Interfaces/Protocols                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Infrastructure Layer (Data)          │
│  - MetadataRepository (SQLAlchemy ORM)  │
│  - DynamicDataRepository (SQLAlchemy Core)│
│  - TableManager (DDL dinámico)          │
│  - JwtTokenService                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         PostgreSQL Database             │
│  - Tablas de metadatos                  │
│  - Tablas dinámicas de datos            │
└─────────────────────────────────────────┘
```

---

## ✅ Funcionalidades Incluidas (CORE)

### 1. Gestión de Metadatos (Admin)

#### 1.1 Entidades
- ✅ Crear entidad con nombre, display_name y descripción
- ✅ Listar todas las entidades creadas
- ✅ Editar entidad existente
- ✅ Eliminar entidad (hard delete por simplicidad)

#### 1.2 Campos de Entidades
- ✅ Agregar campos a una entidad
- ✅ Tipos de campo soportados:
  - TEXT (string)
  - NUMBER (decimal)
  - INTEGER (int)
  - DATE (datetime)
  - BOOLEAN (bool)
- ✅ Configuración por campo:
  - Nombre del campo
  - Display name
  - Es requerido (is_required)
  - Longitud máxima (para TEXT)
- ✅ Listar campos de una entidad
- ✅ Eliminar campo

#### 1.3 Creación Dinámica de Tablas
- ✅ Al crear una entidad, se crea automáticamente una tabla `entity_{guid}` en PostgreSQL
- ✅ Columnas generadas según los campos definidos
- ✅ Al agregar un campo, se hace ALTER TABLE automáticamente

### 2. CRUD Genérico de Datos

#### 2.1 Operaciones sobre Registros
- ✅ **Crear registro:** POST con datos dinámicos según campos de la entidad
- ✅ **Listar registros:** GET con paginación básica (page, pageSize)
- ✅ **Obtener registro:** GET por ID
- ✅ **Actualizar registro:** PUT con datos parciales
- ✅ **Eliminar registro:** DELETE (hard delete)

#### 2.2 Motor de Queries Dinámicas
- ✅ Construcción de SQL dinámico basado en metadatos
- ✅ Validación de tipos de datos
- ✅ Validación de campos requeridos
- ✅ Manejo de valores NULL

### 3. Autenticación y Autorización Básica

#### 3.1 Sistema de Usuarios Simple
- ✅ Tabla `users` con username y password hash
- ✅ Endpoint de registro (POST /api/auth/register)
- ✅ Endpoint de login (POST /api/auth/login)
- ✅ Generación de token JWT
- ✅ Middleware de autenticación JWT

#### 3.2 Autorización Básica
- ✅ Dos roles simples: Admin y User
- ✅ Admin: Puede gestionar metadatos y datos
- ✅ User: Solo puede gestionar datos (CRUD de registros)
- ✅ Atributo [Authorize] en controllers

### 4. Frontend

#### 4.1 Pantalla de Login
- ✅ Formulario de login
- ✅ Almacenamiento de token en localStorage
- ✅ Redirección automática

#### 4.2 Admin de Entidades (Solo Admin)
- ✅ Listado de entidades creadas
- ✅ Formulario para crear nueva entidad
- ✅ Formulario para agregar campos a entidad
- ✅ Vista previa de estructura de entidad

#### 4.3 CRUD Dinámico (Admin y User)
- ✅ Selector de entidad
- ✅ Tabla dinámica que muestra registros
- ✅ Botón "Crear nuevo"
- ✅ Formulario dinámico generado según metadatos
- ✅ Validaciones en frontend según metadatos
- ✅ Edición inline o en modal
- ✅ Confirmación de eliminación

#### 4.4 Navegación
- ✅ Layout con sidebar
- ✅ Menú Admin (solo para admins)
- ✅ Menú Entidades (para todos)
- ✅ Logout

---

## ❌ Funcionalidades NO Incluidas (Fuera de Scope)

Para mantener el proyecto en 30 horas, **NO se incluyen:**

- ❌ Keycloak o sistemas de auth complejos
- ❌ Sistema de auditoría completo
- ❌ Rollback/Versionado de cambios
- ❌ Reportes y métricas
- ❌ Relaciones entre entidades (FK, 1-N, N-N)
- ❌ Vistas configurables
- ❌ Validaciones avanzadas (regex, custom rules)
- ❌ Soft deletes
- ❌ Filtros avanzados y búsqueda
- ❌ Ordenamiento personalizado
- ❌ Exportación de datos
- ❌ Tests unitarios extensivos (solo smoke tests)
- ❌ Websockets o real-time
- ❌ Internacionalización
- ❌ Temas/personalización de UI

---

## 📊 Modelo de Base de Datos (Simplificado)

### Tablas de Metadatos

#### `entities`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | Nombre único de la entidad |
| display_name | VARCHAR(200) | Nombre para mostrar |
| description | TEXT | Descripción |
| table_name | VARCHAR(100) | Nombre de tabla física (entity_{id}) |
| created_at | TIMESTAMP | Fecha de creación |

#### `entity_fields`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID | PK |
| entity_id | UUID | FK a entities |
| name | VARCHAR(100) | Nombre del campo |
| display_name | VARCHAR(200) | Nombre para mostrar |
| field_type | VARCHAR(50) | TEXT, NUMBER, INTEGER, DATE, BOOLEAN |
| is_required | BOOLEAN | Si es obligatorio |
| max_length | INTEGER | Longitud máxima (TEXT) |
| column_name | VARCHAR(100) | Nombre en tabla física |
| display_order | INTEGER | Orden de visualización |
| created_at | TIMESTAMP | Fecha de creación |

### Tablas de Autenticación

#### `users`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID | PK |
| username | VARCHAR(100) | Nombre de usuario único |
| email | VARCHAR(200) | Email |
| password_hash | VARCHAR(500) | Hash bcrypt |
| role | VARCHAR(20) | Admin o User |
| created_at | TIMESTAMP | Fecha de creación |

### Tablas Dinámicas de Datos

#### `entity_{entityId}` (Generadas automáticamente)
```sql
CREATE TABLE entity_a1b2c3d4 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    -- Columnas dinámicas según campos definidos
    campo1 VARCHAR(200),
    campo2 DECIMAL(10,2),
    campo3 DATE,
    campo4 BOOLEAN
);
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login y obtener JWT

### Metadatos (Requiere Auth Admin)
- `GET /api/metadata/entities` - Listar entidades
- `GET /api/metadata/entities/{id}` - Obtener entidad con campos
- `POST /api/metadata/entities` - Crear entidad
- `PUT /api/metadata/entities/{id}` - Actualizar entidad
- `DELETE /api/metadata/entities/{id}` - Eliminar entidad
- `POST /api/metadata/entities/{entityId}/fields` - Agregar campo
- `DELETE /api/metadata/entities/{entityId}/fields/{fieldId}` - Eliminar campo

### CRUD Dinámico (Requiere Auth)
- `GET /api/entities/{entityId}/records` - Listar registros (con paginación)
- `GET /api/entities/{entityId}/records/{recordId}` - Obtener registro
- `POST /api/entities/{entityId}/records` - Crear registro
- `PUT /api/entities/{entityId}/records/{recordId}` - Actualizar registro
- `DELETE /api/entities/{entityId}/records/{recordId}` - Eliminar registro

---

## 📁 Estructura de Proyectos

### Backend
```
backend/
├── app/
│   ├── domain/
│   │   ├── entities.py          # Entity, EntityField, User
│   │   └── interfaces.py        # Protocols/Interfaces
│   ├── application/
│   │   ├── dto/
│   │   │   ├── metadata_dto.py
│   │   │   ├── crud_dto.py
│   │   │   └── auth_dto.py
│   │   └── services/
│   │       ├── metadata_service.py
│   │       ├── crud_service.py
│   │       ├── auth_service.py
│   │       └── query_builder.py
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── models.py        # SQLAlchemy ORM models
│   │   │   ├── repositories/
│   │   │   │   ├── metadata_repository.py
│   │   │   │   └── dynamic_data_repository.py
│   │   │   ├── table_manager.py # DDL dinámico
│   │   │   └── database.py      # Session y engine
│   │   └── security/
│   │       └── jwt_service.py
│   └── api/
│       ├── routers/
│       │   ├── auth.py
│       │   ├── metadata.py
│       │   └── crud.py
│       ├── middleware/
│       │   └── error_handler.py
│       └── main.py              # FastAPI app
├── alembic/                     # Migraciones
│   ├── versions/
│   └── env.py
├── tests/
│   └── test_smoke.py
├── requirements.txt
├── .env.example
└── README.md
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── admin/
│   │   │   ├── EntityBuilder.tsx
│   │   │   └── FieldManager.tsx
│   │   └── crud/
│   │       ├── DynamicList.tsx
│   │       └── DynamicForm.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── metadataService.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useMetadata.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── EntityManagement.tsx
│   │   └── EntityRecords.tsx
│   └── App.tsx
└── package.json
```

---

## 🚀 Plan de Despliegue

### Desarrollo Local
```bash
# Backend
docker-compose up -d postgres
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Producción

#### Opción 1: Railway (Recomendado)
- Deploy automático desde GitHub
- PostgreSQL incluido
- URL pública automática
- **Gratis para demos**

#### Opción 2: Render
- Backend: Web Service
- DB: PostgreSQL (gratis)
- Frontend: Static Site

#### Opción 3: Azure App Service
- App Service + PostgreSQL Flexible Server
- GitHub Actions para deploy
- Requiere suscripción (puede usar créditos de estudiante)

---

## ⏱️ Distribución de Tiempo (30 horas)

| Fase | Tarea | Horas |
|------|-------|-------|
| **1. Setup** | Estructura de proyectos, Docker, Git | 2h |
| **2. Auth** | Sistema de usuarios y JWT | 2h |
| **3. Metadatos Backend** | Entidades, campos, repositorios | 6h |
| **4. CRUD Backend** | Motor dinámico, queries, validaciones | 8h |
| **5. Frontend Admin** | Crear entidades y campos | 4h |
| **6. Frontend CRUD** | Listado y formulario dinámico | 6h |
| **7. Deploy** | Docker, CI/CD, Railway/Render | 2h |
| **Total** | | **30h** |

---

## 📝 Criterios de Éxito

✅ **Funcional:**
1. Administrador puede crear al menos 2 entidades diferentes
2. Cada entidad tiene al menos 4 campos de tipos variados
3. Se pueden crear, editar, listar y eliminar registros
4. Auth funciona y protege rutas admin
5. Sistema desplegado y accesible públicamente

✅ **Técnico:**
1. Clean Architecture visible en estructura de carpetas
2. API REST documentada (Swagger)
3. Frontend responsive básico
4. Sin errores críticos en consola

✅ **Documentación:**
1. README con instrucciones de setup
2. Capturas de pantalla funcionando
3. URL del deploy
4. Backlog de GitHub Projects completo

---

## 🎓 Valor Académico

Este proyecto demuestra:
- ✅ Arquitectura en capas (Clean Architecture)
- ✅ Generación dinámica de código/queries
- ✅ Metaprogramación y reflexión
- ✅ API REST design
- ✅ Frontend dinámico y componentes reutilizables
- ✅ Ciclo completo de desarrollo (backlog → código → deploy)
- ✅ Uso de herramientas profesionales (Git, Docker, CI/CD)

---

## 📚 Recursos Útiles

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Railway Docs](https://docs.railway.app/)

---

**Última actualización:** Enero 2026

