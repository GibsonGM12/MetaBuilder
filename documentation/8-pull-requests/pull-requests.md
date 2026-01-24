# Pull Requests Planificados - MetaBuilder

## Resumen de PRs

| PR | Título | Épica | Tickets Incluidos | Revisores |
|----|--------|-------|-------------------|-----------|
| PR-001 | Setup inicial del proyecto | EP-01 | TK-BE-001, TK-BE-002, TK-INFRA-001, TK-INFRA-002 | Backend Lead |
| PR-002 | Configuración de base de datos | EP-01 | TK-DBA-001, TK-DBA-002 | DBA, Backend |
| PR-003 | Setup proyecto frontend | EP-01 | TK-FE-001, TK-FE-002, TK-FE-003 | Frontend Lead |
| PR-004 | Sistema de autenticación backend | EP-02 | TK-DBA-003, TK-BE-003 a TK-BE-010 | Backend Lead, Security |
| PR-005 | API de metadatos | EP-03 | TK-BE-011 a TK-BE-016, TK-DBA-004 | Backend Lead, DBA |
| PR-006 | Motor CRUD dinámico | EP-04 | TK-BE-017 a TK-BE-023 | Backend Lead |
| PR-007 | Frontend - Auth y Layout | EP-05 | TK-FE-004 a TK-FE-009 | Frontend Lead |
| PR-008 | Frontend - Admin de entidades | EP-05 | TK-FE-010, TK-FE-011, TK-FE-012 | Frontend Lead |
| PR-009 | Frontend - CRUD dinámico | EP-06 | TK-FE-013 a TK-FE-019 | Frontend Lead |
| PR-010 | Deploy y documentación | EP-07 | TK-INFRA-003, TK-INFRA-004, TK-DBA-005, TK-DBA-006 | DevOps, QA |

---

## PR-001: Setup inicial del proyecto

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-001 |
| **Título** | feat: Setup inicial del proyecto backend |
| **Rama origen** | `feature/setup-backend` |
| **Rama destino** | `develop` |
| **Épica** | EP-01: Setup y Configuración |
| **Autor** | Backend Developer |
| **Revisores** | Backend Lead |

### Alcance

Configuración inicial del proyecto backend con estructura Clean Architecture, Docker Compose para PostgreSQL, y archivos de configuración.

### Archivos/Carpetas Afectadas

```
backend/
├── app/
│   ├── __init__.py
│   ├── domain/
│   │   └── __init__.py
│   ├── application/
│   │   ├── __init__.py
│   │   ├── services/
│   │   │   └── __init__.py
│   │   └── dto/
│   │       └── __init__.py
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── repositories/
│   │   │       └── __init__.py
│   │   └── security/
│   │       └── __init__.py
│   └── api/
│       ├── __init__.py
│       ├── routers/
│       │   └── __init__.py
│       └── middleware/
│           └── __init__.py
├── tests/
│   └── __init__.py
├── requirements.txt
└── .env.example
docker-compose.yml
.gitignore
```

### Checklist de Revisión

- [ ] Estructura de carpetas sigue Clean Architecture
- [ ] Todos los `__init__.py` están presentes
- [ ] `requirements.txt` tiene versiones fijadas
- [ ] `docker-compose.yml` levanta PostgreSQL correctamente
- [ ] `.env.example` tiene todas las variables documentadas
- [ ] `.gitignore` excluye archivos sensibles
- [ ] No hay credenciales hardcodeadas
- [ ] README actualizado con instrucciones de setup

### Tests Mínimos

- [ ] `docker-compose up -d postgres` funciona
- [ ] `pip install -r requirements.txt` sin errores
- [ ] Estructura de imports funciona

### Notas para el Revisor

Verificar que la estructura permita la inyección de dependencias y que las capas no tengan dependencias circulares.

---

## PR-002: Configuración de base de datos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-002 |
| **Título** | feat: Configurar SQLAlchemy y Alembic |
| **Rama origen** | `feature/database-setup` |
| **Rama destino** | `develop` |
| **Épica** | EP-01: Setup y Configuración |
| **Autor** | DBA / Backend Developer |
| **Revisores** | DBA, Backend Lead |

### Alcance

Configuración de SQLAlchemy con PostgreSQL y Alembic para migraciones.

### Archivos/Carpetas Afectadas

```
backend/
├── app/
│   └── infrastructure/
│       └── database/
│           ├── database.py          # Engine, Session, Base
│           └── models.py            # (vacío por ahora)
├── alembic/
│   ├── versions/
│   ├── env.py
│   ├── script.py.mako
│   └── README
└── alembic.ini
```

### Checklist de Revisión

- [ ] Connection string viene de variable de entorno
- [ ] `get_db()` funciona como dependencia de FastAPI
- [ ] Alembic configurado correctamente
- [ ] `alembic revision --autogenerate` funciona
- [ ] `alembic upgrade head` ejecuta sin errores
- [ ] No hay credenciales en código

### Tests Mínimos

- [ ] Conexión exitosa a PostgreSQL
- [ ] Crear y aplicar migración de prueba

---

## PR-003: Setup proyecto frontend

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-003 |
| **Título** | feat: Setup proyecto React con Vite y TailwindCSS |
| **Rama origen** | `feature/setup-frontend` |
| **Rama destino** | `develop` |
| **Épica** | EP-01: Setup y Configuración |
| **Autor** | Frontend Developer |
| **Revisores** | Frontend Lead |

### Alcance

Inicialización del proyecto frontend con React, TypeScript, Vite, TailwindCSS y dependencias básicas.

### Archivos/Carpetas Afectadas

```
frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

### Checklist de Revisión

- [ ] TypeScript configurado correctamente
- [ ] TailwindCSS funciona
- [ ] React Router instalado
- [ ] Axios instalado
- [ ] `npm run dev` funciona
- [ ] `npm run build` sin errores
- [ ] ESLint configurado (opcional)

### Tests Mínimos

- [ ] Aplicación arranca en localhost:5173
- [ ] Clases de Tailwind se aplican
- [ ] Sin errores en consola

---

## PR-004: Sistema de autenticación backend

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-004 |
| **Título** | feat: Implementar autenticación JWT |
| **Rama origen** | `feature/auth-backend` |
| **Rama destino** | `develop` |
| **Épica** | EP-02: Autenticación JWT |
| **Autor** | Backend Developer |
| **Revisores** | Backend Lead, Security Reviewer |

### Alcance

Implementación completa del sistema de autenticación: modelo User, servicios JWT y bcrypt, endpoints de registro y login, middleware de autorización.

### Archivos/Carpetas Afectadas

```
backend/
├── app/
│   ├── domain/
│   │   └── entities.py              # User entity
│   ├── application/
│   │   ├── services/
│   │   │   └── auth_service.py
│   │   └── dto/
│   │       └── auth_dto.py
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── models.py            # UserModel
│   │   │   └── repositories/
│   │   │       └── user_repository.py
│   │   └── security/
│   │       └── jwt_service.py       # JWT + password hashing
│   └── api/
│       ├── main.py
│       ├── dependencies.py          # get_current_user, get_current_admin
│       └── routers/
│           └── auth.py
└── alembic/
    └── versions/
        └── xxx_create_users_table.py
```

### Checklist de Revisión

- [ ] Passwords se hashean con bcrypt (salt rounds >= 12)
- [ ] JWT tiene expiración configurada (24h)
- [ ] Secret key viene de variable de entorno
- [ ] No se almacenan passwords en texto plano
- [ ] Endpoint de login valida credenciales correctamente
- [ ] Middleware rechaza tokens inválidos/expirados
- [ ] `get_current_admin` verifica rol
- [ ] Migración crea tabla users con constraints
- [ ] DTOs validan inputs
- [ ] Errores no exponen información sensible

### Tests Mínimos

- [ ] Registrar usuario nuevo
- [ ] Login con credenciales correctas retorna token
- [ ] Login con credenciales incorrectas retorna 401
- [ ] Endpoint protegido rechaza request sin token
- [ ] Endpoint protegido acepta request con token válido
- [ ] Endpoint de admin rechaza usuario con rol User

### Notas para el Revisor

**Seguridad crítica**: Verificar que no haya vulnerabilidades de:
- Passwords expuestos en logs
- Tokens sin expiración
- SQL injection en queries
- Información sensible en respuestas de error

---

## PR-005: API de metadatos

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-005 |
| **Título** | feat: Implementar API de gestión de metadatos |
| **Rama origen** | `feature/metadata-api` |
| **Rama destino** | `develop` |
| **Épica** | EP-03: Gestión de Metadatos |
| **Autor** | Backend Developer |
| **Revisores** | Backend Lead, DBA |

### Alcance

CRUD completo de entidades y campos, incluyendo creación dinámica de tablas en PostgreSQL.

### Archivos/Carpetas Afectadas

```
backend/
├── app/
│   ├── domain/
│   │   ├── entities.py              # Entity, EntityField, FieldType
│   │   └── interfaces.py            # Repository protocols
│   ├── application/
│   │   ├── services/
│   │   │   └── metadata_service.py
│   │   └── dto/
│   │       └── metadata_dto.py
│   ├── infrastructure/
│   │   └── database/
│   │       ├── models.py            # EntityModel, EntityFieldModel
│   │       ├── table_manager.py     # DDL dinámico
│   │       └── repositories/
│   │           └── metadata_repository.py
│   └── api/
│       ├── main.py                  # Registrar router
│       └── routers/
│           └── metadata.py
└── alembic/
    └── versions/
        └── xxx_create_metadata_tables.py
```

### Checklist de Revisión

- [ ] CRUD de entidades funciona
- [ ] CRUD de campos funciona
- [ ] table_name se genera como `entity_{uuid}`
- [ ] CREATE TABLE se ejecuta al crear entidad
- [ ] ALTER TABLE se ejecuta al agregar campo
- [ ] DROP TABLE se ejecuta al eliminar entidad
- [ ] Validación de nombre único de entidad
- [ ] Validación de nombre único de campo en entidad
- [ ] Cascade delete funciona (entidad -> campos)
- [ ] Solo Admin puede acceder
- [ ] Documentación en Swagger

### Tests Mínimos

- [ ] Crear entidad genera tabla física
- [ ] Agregar campo ejecuta ALTER TABLE
- [ ] Eliminar entidad elimina tabla física
- [ ] Nombre duplicado retorna error
- [ ] Usuario normal no puede acceder (403)

### Notas para el Revisor

**DDL dinámico**: Verificar que:
- Los tipos SQL se mapean correctamente
- No hay SQL injection en nombres de tabla/columna
- Errores de DDL se manejan correctamente (rollback)

---

## PR-006: Motor CRUD dinámico

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-006 |
| **Título** | feat: Implementar motor de CRUD dinámico |
| **Rama origen** | `feature/dynamic-crud` |
| **Rama destino** | `develop` |
| **Épica** | EP-04: Motor CRUD Dinámico |
| **Autor** | Backend Developer |
| **Revisores** | Backend Lead |

### Alcance

Motor genérico de CRUD que funciona sobre cualquier entidad definida en metadatos, incluyendo validación de datos, construcción de queries dinámicas y paginación.

### Archivos/Carpetas Afectadas

```
backend/
├── app/
│   ├── application/
│   │   ├── services/
│   │   │   ├── crud_service.py
│   │   │   ├── query_builder.py
│   │   │   └── data_validator.py
│   │   └── dto/
│   │       └── crud_dto.py
│   ├── infrastructure/
│   │   └── database/
│   │       └── repositories/
│   │           └── dynamic_data_repository.py
│   └── api/
│       ├── main.py
│       ├── routers/
│       │   └── crud.py
│       └── middleware/
│           └── error_handler.py
```

### Checklist de Revisión

- [ ] CRUD completo funciona sobre tablas dinámicas
- [ ] Paginación funciona (LIMIT/OFFSET)
- [ ] Validación de campos requeridos
- [ ] Validación de tipos de datos
- [ ] Validación de max_length
- [ ] QueryBuilder usa parámetros (no concatenación)
- [ ] Errores de validación retornan lista clara
- [ ] Error handler retorna JSON consistente
- [ ] Admin y User pueden acceder
- [ ] Entidad no encontrada retorna 404

### Tests Mínimos

- [ ] Crear registro en entidad existente
- [ ] Listar registros con paginación
- [ ] Actualizar registro existente
- [ ] Eliminar registro existente
- [ ] Validación rechaza datos inválidos
- [ ] SQL injection no es posible

### Notas para el Revisor

**Seguridad crítica**: Revisar exhaustivamente QueryBuilder para asegurar que no hay vulnerabilidades de SQL injection.

---

## PR-007: Frontend - Auth y Layout

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-007 |
| **Título** | feat: Implementar autenticación y layout en frontend |
| **Rama origen** | `feature/frontend-auth` |
| **Rama destino** | `develop` |
| **Épica** | EP-05: Frontend Admin |
| **Autor** | Frontend Developer |
| **Revisores** | Frontend Lead |

### Alcance

Servicios de API, contexto de autenticación, página de login, layout con sidebar, y routing protegido.

### Archivos/Carpetas Afectadas

```
frontend/src/
├── services/
│   ├── api.ts
│   └── authService.ts
├── hooks/
│   └── useAuth.ts
├── context/
│   └── AuthContext.tsx
├── components/
│   └── layout/
│       ├── Layout.tsx
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── ProtectedRoute.tsx
├── pages/
│   ├── Login.tsx
│   └── Dashboard.tsx
├── types/
│   └── auth.ts
└── App.tsx
```

### Checklist de Revisión

- [ ] Axios intercepta y agrega token
- [ ] Token se persiste en localStorage
- [ ] Login funciona correctamente
- [ ] Logout limpia token y redirige
- [ ] Rutas protegidas redirigen a login
- [ ] Sidebar muestra opciones según rol
- [ ] Diseño responsive
- [ ] Sin errores de TypeScript
- [ ] Sin warnings en consola

### Tests Mínimos

- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas muestra error
- [ ] Navegación a ruta protegida sin token redirige
- [ ] Logout funciona

---

## PR-008: Frontend - Admin de entidades

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-008 |
| **Título** | feat: Implementar administración de entidades |
| **Rama origen** | `feature/frontend-admin` |
| **Rama destino** | `develop` |
| **Épica** | EP-05: Frontend Admin |
| **Autor** | Frontend Developer |
| **Revisores** | Frontend Lead |

### Alcance

Pantallas de administración de entidades y campos para usuarios Admin.

### Archivos/Carpetas Afectadas

```
frontend/src/
├── services/
│   └── metadataService.ts
├── hooks/
│   └── useMetadata.ts
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── admin/
│       ├── EntityBuilder.tsx
│       └── FieldManager.tsx
├── pages/
│   └── admin/
│       └── EntityManagement.tsx
└── types/
    └── metadata.ts
```

### Checklist de Revisión

- [ ] Lista de entidades carga correctamente
- [ ] Crear entidad funciona
- [ ] Agregar campo funciona
- [ ] Eliminar entidad con confirmación
- [ ] Eliminar campo con confirmación
- [ ] Validaciones frontend
- [ ] Feedback de éxito/error
- [ ] Solo visible para Admin

### Tests Mínimos

- [ ] Crear nueva entidad
- [ ] Agregar campos de diferentes tipos
- [ ] Eliminar entidad

---

## PR-009: Frontend - CRUD dinámico

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-009 |
| **Título** | feat: Implementar CRUD dinámico de registros |
| **Rama origen** | `feature/frontend-crud` |
| **Rama destino** | `develop` |
| **Épica** | EP-06: Frontend CRUD Dinámico |
| **Autor** | Frontend Developer |
| **Revisores** | Frontend Lead |

### Alcance

Componentes de tabla y formulario dinámico para gestionar registros de cualquier entidad.

### Archivos/Carpetas Afectadas

```
frontend/src/
├── services/
│   └── crudService.ts
├── hooks/
│   └── useDynamicEntity.ts
├── components/
│   ├── common/
│   │   └── LoadingSpinner.tsx
│   └── crud/
│       ├── DynamicTable.tsx
│       └── DynamicForm.tsx
├── pages/
│   └── entities/
│       ├── EntitySelector.tsx
│       └── RecordList.tsx
└── types/
    └── crud.ts
```

### Checklist de Revisión

- [ ] Tabla genera columnas desde metadatos
- [ ] Formulario genera inputs según tipo de campo
- [ ] Paginación funciona
- [ ] Crear registro funciona
- [ ] Editar registro funciona
- [ ] Eliminar registro con confirmación
- [ ] Validaciones frontend
- [ ] Loading states
- [ ] Mensajes de error amigables

### Tests Mínimos

- [ ] Listar registros de una entidad
- [ ] Crear nuevo registro
- [ ] Editar registro existente
- [ ] Eliminar registro
- [ ] Paginación navega correctamente

---

## PR-010: Deploy y documentación

### Información General

| Campo | Valor |
|-------|-------|
| **ID** | PR-010 |
| **Título** | feat: Deploy en Railway y documentación final |
| **Rama origen** | `feature/deploy` |
| **Rama destino** | `main` |
| **Épica** | EP-07: Deploy y Documentación |
| **Autor** | DevOps |
| **Revisores** | DevOps Lead, QA |

### Alcance

Dockerfile, configuración de Railway, seeds de datos de demo, y README completo.

### Archivos/Carpetas Afectadas

```
backend/
├── Dockerfile
└── scripts/
    └── seed.py (o seed.sql)
frontend/
└── (configuración de Vercel si aplica)
README.md
.github/
└── workflows/
    └── deploy.yml (opcional)
```

### Checklist de Revisión

- [ ] Dockerfile construye correctamente
- [ ] Deploy en Railway funciona
- [ ] Deploy frontend funciona
- [ ] Variables de entorno configuradas en producción
- [ ] CORS configurado para producción
- [ ] Seeds crean datos de demo
- [ ] Usuario admin accesible
- [ ] README completo con:
  - [ ] Descripción del proyecto
  - [ ] Stack tecnológico
  - [ ] Instrucciones de instalación
  - [ ] Variables de entorno
  - [ ] URLs de producción
  - [ ] Credenciales de demo
  - [ ] Capturas de pantalla

### Tests Mínimos (QA)

- [ ] Login funciona en producción
- [ ] CRUD de entidades funciona
- [ ] CRUD de registros funciona
- [ ] Responsive en móvil
- [ ] Sin errores en consola
- [ ] Performance aceptable

### Notas para el Revisor

Este PR va directo a `main` y representa el release del MVP. Asegurar que:
- Todos los PRs anteriores están mergeados
- No hay código de debug
- Logs de producción configurados
- Secrets no están expuestos

---

## Flujo de Merge

```
feature/setup-backend ──────┐
feature/database-setup ─────┤
feature/setup-frontend ─────┼──▶ develop ──▶ staging (QA) ──▶ main (prod)
feature/auth-backend ───────┤
feature/metadata-api ───────┤
feature/dynamic-crud ───────┤
feature/frontend-auth ──────┤
feature/frontend-admin ─────┤
feature/frontend-crud ──────┤
feature/deploy ─────────────┘
```

## Convenciones de Nombres

### Ramas

- `feature/xxx` - Nueva funcionalidad
- `bugfix/xxx` - Corrección de bugs
- `hotfix/xxx` - Corrección urgente en producción
- `release/vX.X` - Preparación de release

### Commits (Conventional Commits)

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `style:` - Formato, sin cambio de lógica
- `refactor:` - Refactorización
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

### Ejemplos

```
feat: add user authentication with JWT
fix: handle expired tokens correctly
docs: update README with setup instructions
refactor: extract query builder to separate class
test: add integration tests for CRUD endpoints
chore: update dependencies to latest versions
```

---

*Última actualización: Enero 2026*
