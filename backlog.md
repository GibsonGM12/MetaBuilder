# BACKLOG - Sistema Low-Code Platform MVP
## Proyecto de Curso - 30 Horas Total

---

## 📋 Estructura del Backlog

- **6 Epics**
- **32 User Stories / Tasks**
- **Estimación total:** 30 horas
- **Prioridad:** Todas son P0 (críticas para MVP)

---

## 🎯 EPIC 1: Setup y Configuración Inicial
**Objetivo:** Preparar el ambiente de desarrollo y estructura base del proyecto  
**Tiempo estimado:** 2 horas

---

### US-001: Configurar estructura de proyectos backend
**Como** desarrollador  
**Quiero** tener el proyecto Python configurado con Clean Architecture  
**Para** mantener el código organizado y escalable

**Tareas:**
- [ ] Crear estructura de carpetas `backend/app/`
- [ ] Crear módulo `domain/` (entidades puras)
- [ ] Crear módulo `application/` (servicios y DTOs)
- [ ] Crear módulo `infrastructure/` (repositorios y acceso a datos)
- [ ] Crear módulo `api/` (routers FastAPI)
- [ ] Crear `requirements.txt` con dependencias base
- [ ] Crear `__init__.py` en cada módulo
- [ ] Configurar `pyproject.toml` o `setup.py` (opcional)

**Criterios de aceptación:**
- ✅ Estructura de carpetas sigue Clean Architecture
- ✅ Las dependencias entre capas son correctas (domain no importa nada, infrastructure importa domain, etc.)
- ✅ Estructura de carpetas visible y organizada
- ✅ `requirements.txt` incluye FastAPI, SQLAlchemy, Pydantic

**Estimación:** 30 minutos

**Prompt sugerido:**
```
Crea una estructura de proyecto Python con FastAPI siguiendo Clean Architecture de 4 capas.
Estructura: domain/ (entidades puras), application/ (servicios), infrastructure/ (datos),
y api/ (routers). Crea requirements.txt con FastAPI, SQLAlchemy, Pydantic, alembic.
```

---

### US-002: Configurar Docker Compose con PostgreSQL
**Como** desarrollador  
**Quiero** tener PostgreSQL corriendo en Docker  
**Para** no depender de instalaciones locales

**Tareas:**
- [ ] Crear `docker-compose.yml` en la raíz
- [ ] Configurar servicio PostgreSQL 15
- [ ] Configurar variables de entorno
- [ ] Crear volumen para persistencia
- [ ] Probar conexión desde pgAdmin o DBeaver

**Criterios de aceptación:**
- ✅ `docker-compose up -d` levanta PostgreSQL
- ✅ Se puede conectar a la base de datos en localhost:5432
- ✅ Los datos persisten al reiniciar el contenedor

**Estimación:** 20 minutos

**Archivo docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: lowcodeplatform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

### US-003: Configurar repositorio Git y estructura de carpetas
**Como** desarrollador  
**Quiero** tener el proyecto en GitHub con estructura clara  
**Para** tener control de versiones y mostrar el progreso

**Tareas:**
- [ ] Crear repositorio en GitHub
- [ ] Crear `.gitignore` para Python y React
- [ ] Crear README.md básico
- [ ] Hacer commit inicial
- [ ] Crear estructura de carpetas para frontend

**Criterios de aceptación:**
- ✅ Repositorio creado y público
- ✅ Primer commit hecho
- ✅ README con nombre del proyecto y descripción básica
- ✅ .gitignore funcional (no sube bin, obj, node_modules)

**Estimación:** 20 minutos

---

### US-004: Configurar SQLAlchemy y Alembic
**Como** desarrollador  
**Quiero** configurar SQLAlchemy con PostgreSQL y Alembic  
**Para** poder crear y gestionar la base de datos

**Tareas:**
- [ ] Instalar paquetes: `sqlalchemy`, `alembic`, `psycopg2-binary` o `asyncpg`
- [ ] Crear `database.py` en Infrastructure con engine y session
- [ ] Configurar connection string en `.env`
- [ ] Crear `models.py` con modelos SQLAlchemy base
- [ ] Inicializar Alembic: `alembic init alembic`
- [ ] Configurar `alembic/env.py` con connection string
- [ ] Crear primera migración: `alembic revision --autogenerate -m "Initial"`
- [ ] Aplicar migración: `alembic upgrade head`

**Criterios de aceptación:**
- ✅ SQLAlchemy se conecta correctamente a PostgreSQL
- ✅ `alembic revision --autogenerate` funciona
- ✅ `alembic upgrade head` aplica migraciones
- ✅ La base de datos se crea en PostgreSQL

**Estimación:** 30 minutos

**Prompt sugerido:**
```
Configura SQLAlchemy con PostgreSQL y Alembic en el proyecto.
Crea database.py con engine y session, configura Alembic para migraciones.
Usa psycopg2-binary para PostgreSQL y configura variables de entorno.
```

---

### US-005: Configurar proyecto React con Vite y TailwindCSS
**Como** desarrollador  
**Quiero** tener el frontend configurado  
**Para** empezar a desarrollar la UI

**Tareas:**
- [ ] Crear proyecto con `npm create vite@latest frontend -- --template react-ts`
- [ ] Instalar TailwindCSS: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Configurar Tailwind (`tailwind.config.js`)
- [ ] Instalar dependencias: `react-router-dom`, `axios`
- [ ] Crear estructura de carpetas básica
- [ ] Probar que `npm run dev` funciona

**Criterios de aceptación:**
- ✅ Proyecto React arranca en http://localhost:5173
- ✅ TailwindCSS funciona (probar con clases de Tailwind)
- ✅ TypeScript configurado correctamente

**Estimación:** 20 minutos

---

## 🔐 EPIC 2: Autenticación y Autorización JWT
**Objetivo:** Implementar sistema de usuarios y autenticación con JWT  
**Tiempo estimado:** 2 horas

---

### US-006: Crear entidad User y tabla en base de datos
**Como** desarrollador  
**Quiero** tener un modelo de usuario en el dominio  
**Para** gestionar la autenticación

**Tareas:**
- [ ] Crear clase `User` en `domain/entities.py`
- [ ] Propiedades: id, username, email, password_hash, role, created_at
- [ ] Crear modelo SQLAlchemy `UserModel` en `infrastructure/database/models.py`
- [ ] Configurar tabla con SQLAlchemy
- [ ] Crear migración Alembic: `alembic revision --autogenerate -m "AddUsersTable"`
- [ ] Aplicar migración: `alembic upgrade head`

**Criterios de aceptación:**
- ✅ Clase User creada con propiedades correctas
- ✅ Tabla `users` existe en PostgreSQL
- ✅ Campos tienen tipos y constraints correctos

**Estimación:** 20 minutos

---

### US-007: Implementar servicio de autenticación y JWT
**Como** desarrollador  
**Quiero** un servicio que genere y valide tokens JWT  
**Para** proteger los endpoints

**Tareas:**
- [ ] Instalar paquetes: `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`
- [ ] Crear protocolo `AuthService` en `application/interfaces.py`
- [ ] Crear `auth_service.py` en `application/services/`
- [ ] Implementar método `register(username, email, password, role)`
- [ ] Implementar método `login(username, password)` que retorne JWT
- [ ] Crear `jwt_service.py` en `infrastructure/security/`
- [ ] Configurar secreto JWT en `.env`

**Criterios de aceptación:**
- ✅ AuthService puede registrar usuarios con password hasheado (bcrypt)
- ✅ AuthService puede validar credenciales
- ✅ JwtService genera tokens válidos con claims (user_id, username, role)

**Estimación:** 45 minutos

**Prompt sugerido:**
```
Implementa un servicio de autenticación en FastAPI que:
1. Use passlib con bcrypt para hashear passwords
2. Genere tokens JWT con python-jose con claims: user_id, username, role
3. Valide credenciales contra la base de datos usando SQLAlchemy
4. Incluye métodos register y login
```

---

### US-008: Crear endpoints de autenticación (AuthRouter)
**Como** usuario  
**Quiero** poder registrarme y hacer login  
**Para** acceder al sistema

**Tareas:**
- [ ] Crear `auth.py` router en `api/routers/`
- [ ] Crear DTOs con Pydantic: `RegisterRequest`, `LoginRequest`, `AuthResponse`
- [ ] Implementar `POST /api/auth/register`
- [ ] Implementar `POST /api/auth/login`
- [ ] Configurar autenticación JWT en `main.py`
- [ ] Registrar router en FastAPI app
- [ ] Probar endpoints con Postman/curl

**Criterios de aceptación:**
- ✅ POST /api/auth/register crea un usuario y retorna 201
- ✅ POST /api/auth/login valida credenciales y retorna JWT
- ✅ Login con credenciales incorrectas retorna 401
- ✅ OpenAPI/Swagger muestra los endpoints automáticamente

**Estimación:** 30 minutos

**Request examples:**
```json
// POST /api/auth/register
{
  "username": "admin",
  "email": "admin@test.com",
  "password": "Admin123!",
  "role": "Admin"
}

// POST /api/auth/login
{
  "username": "admin",
  "password": "Admin123!"
}

// Response
{
  "token": "eyJhbGc...",
  "username": "admin",
  "role": "Admin"
}
```

---

### US-009: Configurar middleware de autorización
**Como** desarrollador  
**Quiero** proteger endpoints con dependencias FastAPI  
**Para** que solo usuarios autenticados accedan

**Tareas:**
- [ ] Crear dependencia `get_current_user` en `api/dependencies.py`
- [ ] Crear dependencia `get_current_admin` para roles Admin
- [ ] Validar token JWT en dependencias
- [ ] Usar `Depends()` en routers para proteger endpoints
- [ ] Probar con endpoint protegido de prueba

**Criterios de aceptación:**
- ✅ Endpoints con `Depends(get_current_user)` rechazan requests sin token (401)
- ✅ Endpoints con `Depends(get_current_admin)` solo permiten admins
- ✅ Token válido permite acceso

**Estimación:** 25 minutos

---

## 📝 EPIC 3: Gestión de Metadatos (Backend)
**Objetivo:** Implementar CRUD de entidades y campos  
**Tiempo estimado:** 6 horas

---

### US-010: Crear entidades de dominio para metadatos
**Como** desarrollador  
**Quiero** tener modelos de Entity y EntityField  
**Para** representar los metadatos

**Tareas:**
- [ ] Crear clases `Entity` y `EntityField` en `domain/entities.py`
  - Entity: id, name, display_name, description, table_name, created_at
  - EntityField: id, entity_id, name, display_name, field_type, is_required, max_length, column_name, display_order, created_at
- [ ] Crear enum `FieldType` (TEXT, NUMBER, INTEGER, DATE, BOOLEAN)
- [ ] Crear modelos SQLAlchemy `EntityModel` y `EntityFieldModel` en `infrastructure/database/models.py`
- [ ] Configurar relación 1-N entre Entity y EntityField con SQLAlchemy

**Criterios de aceptación:**
- ✅ Clases creadas con propiedades correctas
- ✅ Navegación Entity.Fields funciona
- ✅ Enum FieldType con 5 tipos

**Estimación:** 20 minutos

---

### US-011: Crear tablas de metadatos en base de datos
**Como** desarrollador  
**Quiero** que las tablas entities y entity_fields existan  
**Para** almacenar metadatos

**Tareas:**
- [ ] Agregar modelos SQLAlchemy `EntityModel` y `EntityFieldModel` en `models.py`
- [ ] Configurar constraints e índices únicos con SQLAlchemy
- [ ] Crear migración Alembic: `alembic revision --autogenerate -m "AddMetadataTables"`
- [ ] Aplicar migración: `alembic upgrade head`
- [ ] Verificar que tablas se crearon correctamente

**Criterios de aceptación:**
- ✅ Tabla `entities` existe con columnas correctas
- ✅ Tabla `entity_fields` existe con FK a entities
- ✅ Constraint unique en entities.name
- ✅ FK configurada con cascada

**Estimación:** 25 minutos

---

### US-012: Implementar MetadataRepository
**Como** desarrollador  
**Quiero** un repositorio para gestionar metadatos  
**Para** separar lógica de acceso a datos

**Tareas:**
- [ ] Crear protocolo `MetadataRepository` en `domain/interfaces.py`
- [ ] Métodos: get_all_entities, get_entity_by_id, create_entity, update_entity, delete_entity
- [ ] Métodos: add_field, get_fields, delete_field
- [ ] Crear `metadata_repository.py` en `infrastructure/database/repositories/`
- [ ] Implementar métodos usando SQLAlchemy ORM
- [ ] Registrar en DI (dependency injection) en `main.py`

**Criterios de aceptación:**
- ✅ Todos los métodos implementados
- ✅ get_entity_by_id incluye campos (joinedload o selectinload)
- ✅ create_entity retorna entidad con ID generado
- ✅ Repositorio registrado en DI

**Estimación:** 45 minutos

**Prompt sugerido:**
```
Crea un repositorio MetadataRepository usando SQLAlchemy ORM que permita:
- CRUD completo de entidades
- Agregar y eliminar campos de una entidad
- get_entity_by_id debe incluir los campos relacionados (joinedload)
Usa el patrón Repository y registra en DI con FastAPI.
```

---

### US-013: Implementar MetadataService con lógica de negocio
**Como** desarrollador  
**Quiero** un servicio que orqueste las operaciones de metadatos  
**Para** aplicar validaciones y lógica de negocio

**Tareas:**
- [ ] Crear interface `IMetadataService` en Application/Interfaces
- [ ] Crear `MetadataService.cs` en Application/Services
- [ ] Implementar `CreateEntityAsync(CreateEntityDto)`
  - Validar nombre único
  - Generar TableName (entity_{guid})
  - Guardar en BD
- [ ] Implementar `AddFieldAsync(entityId, AddFieldDto)`
  - Validar nombre único dentro de la entidad
  - Generar ColumnName
- [ ] Implementar `GetAllEntitiesAsync()`, `GetEntityByIdAsync(id)`
- [ ] Implementar `DeleteEntityAsync(id)` (con validación)
- [ ] Registrar en DI

**Criterios de aceptación:**
- ✅ CreateEntity valida nombre duplicado y lanza excepción si existe
- ✅ TableName se genera automáticamente como entity_{guid}
- ✅ AddField valida nombre duplicado en la entidad
- ✅ GetEntityById retorna null si no existe

**Estimación:** 60 minutos

---

### US-014: Crear DTOs para metadatos
**Como** desarrollador  
**Quiero** DTOs para requests y responses  
**Para** no exponer entidades de dominio directamente

**Tareas:**
- [ ] Crear carpeta Application/DTOs/Metadata
- [ ] Crear `CreateEntityDto` (Name, DisplayName, Description)
- [ ] Crear `EntityDto` (incluye lista de FieldDto)
- [ ] Crear `AddFieldDto` (Name, DisplayName, FieldType, IsRequired, MaxLength)
- [ ] Crear `FieldDto`
- [ ] Crear métodos de mapeo (extensiones o AutoMapper)

**Criterios de aceptación:**
- ✅ DTOs tienen validaciones con Data Annotations
- ✅ Mapeo entre Entity ↔ EntityDto funciona
- ✅ DTOs no exponen información sensible

**Estimación:** 30 minutos

---

### US-015: Crear MetadataController con endpoints REST
**Como** administrador  
**Quiero** endpoints REST para gestionar entidades  
**Para** poder crear y configurar entidades desde el frontend

**Tareas:**
- [ ] Crear `MetadataController.cs` en Api/Controllers
- [ ] Agregar `[Authorize(Roles = "Admin")]` al controller
- [ ] Implementar `GET /api/metadata/entities`
- [ ] Implementar `GET /api/metadata/entities/{id}`
- [ ] Implementar `POST /api/metadata/entities`
- [ ] Implementar `PUT /api/metadata/entities/{id}`
- [ ] Implementar `DELETE /api/metadata/entities/{id}`
- [ ] Implementar `POST /api/metadata/entities/{id}/fields`
- [ ] Implementar `DELETE /api/metadata/entities/{entityId}/fields/{fieldId}`
- [ ] Probar todos los endpoints con Postman

**Criterios de aceptación:**
- ✅ Todos los endpoints responden correctamente
- ✅ Validaciones funcionan (ej: nombre duplicado retorna 400)
- ✅ Respuestas tienen formato consistente
- ✅ Solo usuarios Admin pueden acceder
- ✅ Swagger documenta los endpoints

**Estimación:** 60 minutos

**Endpoints esperados:**
```
GET    /api/metadata/entities
GET    /api/metadata/entities/{id}
POST   /api/metadata/entities
PUT    /api/metadata/entities/{id}
DELETE /api/metadata/entities/{id}
POST   /api/metadata/entities/{entityId}/fields
DELETE /api/metadata/entities/{entityId}/fields/{fieldId}
```

---

### US-016: Implementar creación dinámica de tablas
**Como** desarrollador  
**Quiero** que al crear una entidad se cree su tabla en PostgreSQL  
**Para** poder almacenar registros de esa entidad

**Tareas:**
- [ ] Crear protocolo `TableManager` en `domain/interfaces.py`
- [ ] Crear `table_manager.py` en `infrastructure/database/`
- [ ] Implementar `create_table_for_entity(entity, fields)`
  - Construir CREATE TABLE dinámico usando SQLAlchemy DDL
  - Mapear FieldType a tipos SQL (TEXT→VARCHAR, NUMBER→DECIMAL, etc.)
  - Agregar columna id UUID PRIMARY KEY
  - Agregar created_at TIMESTAMP
  - Ejecutar con SQLAlchemy engine
- [ ] Llamar a create_table desde MetadataService después de crear entidad
- [ ] Probar creando una entidad y verificando que la tabla existe

**Criterios de aceptación:**
- ✅ Al crear entidad "productos", se crea tabla entity_{guid}
- ✅ Tabla tiene columna id (UUID PK) y created_at
- ✅ Columnas adicionales según campos definidos
- ✅ Tipos SQL correctos según FieldType

**Estimación:** 90 minutos

**Prompt sugerido:**
```
Implementa un servicio TableManager con SQLAlchemy que:
1. Construya SQL dinámico CREATE TABLE según metadatos usando SQLAlchemy DDL
2. Mapee tipos: TEXT→VARCHAR(n), NUMBER→DECIMAL(10,2), INTEGER→INTEGER, DATE→DATE, BOOLEAN→BOOLEAN
3. Incluya columnas: id UUID PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW()
4. Use SQLAlchemy engine.execute() para ejecutar el SQL
5. Maneja errores si la tabla ya existe
```

---

### US-017: Implementar ALTER TABLE al agregar campos
**Como** administrador  
**Quiero** poder agregar campos a entidades existentes  
**Para** extender entidades sin perder datos

**Tareas:**
- [ ] Implementar `AddColumnToTableAsync(tableName, field)` en TableManager
- [ ] Construir ALTER TABLE dinámico
- [ ] Llamar desde MetadataService.AddFieldAsync después de guardar el campo
- [ ] Probar agregando un campo a entidad existente
- [ ] Verificar que la columna se agregó en PostgreSQL

**Criterios de aceptación:**
- ✅ Al agregar campo vía API, se ejecuta ALTER TABLE
- ✅ La columna nueva aparece en la tabla
- ✅ Registros existentes tienen NULL en el nuevo campo (si no es requerido)
- ✅ Si falla el ALTER, se revierte el cambio en metadata

**Estimación:** 45 minutos

---

## 🔄 EPIC 4: Motor de CRUD Dinámico (Backend)
**Objetivo:** Implementar operaciones CRUD sobre tablas dinámicas  
**Tiempo estimado:** 8 horas

---

### US-018: Crear repositorio de datos dinámicos con SQLAlchemy Core
**Como** desarrollador  
**Quiero** un repositorio que ejecute queries dinámicas  
**Para** interactuar con tablas creadas dinámicamente

**Tareas:**
- [ ] Crear protocolo `DynamicDataRepository` en `domain/interfaces.py`
- [ ] Métodos: get_records, get_record_by_id, insert_record, update_record, delete_record
- [ ] Crear `dynamic_data_repository.py` en `infrastructure/database/repositories/`
- [ ] Inyectar engine de SQLAlchemy
- [ ] Usar SQLAlchemy Core (text, select, insert, update, delete) para todas las operaciones
- [ ] Registrar en DI

**Criterios de aceptación:**
- ✅ Todos los métodos reciben table_name y datos como parámetros
- ✅ Usa SQLAlchemy Core para ejecutar SQL con parámetros
- ✅ Maneja correctamente los parámetros para evitar SQL injection

**Estimación:** 45 minutos

---

### US-019: Implementar DynamicQueryBuilder
**Como** desarrollador  
**Quiero** una clase que construya queries SQL dinámicas  
**Para** generar INSERT, SELECT, UPDATE, DELETE según metadatos

**Tareas:**
- [ ] Crear `DynamicQueryBuilder.cs` en Application/Services
- [ ] Implementar `BuildSelectQuery(tableName, fields)`
- [ ] Implementar `BuildSelectByIdQuery(tableName)`
- [ ] Implementar `BuildInsertQuery(tableName, fields, data)`
- [ ] Implementar `BuildUpdateQuery(tableName, fields, recordId, data)`
- [ ] Implementar `BuildDeleteQuery(tableName, recordId)`
- [ ] Crear tests unitarios básicos (opcional pero recomendado)

**Criterios de aceptación:**
- ✅ BuildInsertQuery genera: `INSERT INTO tabla (col1, col2) VALUES (@val1, @val2) RETURNING id`
- ✅ BuildUpdateQuery genera: `UPDATE tabla SET col1=@val1 WHERE id=@id`
- ✅ Queries usan parámetros, NO concatenación
- ✅ Maneja nombres de columnas con caracteres especiales

**Estimación:** 90 minutos

**Prompt sugerido:**
```
Crea una clase DynamicQueryBuilder que construya queries SQL seguras para:
1. SELECT con lista de campos
2. INSERT con RETURNING id
3. UPDATE solo campos proporcionados
4. DELETE por ID
Usa parámetros nombrados (@param) para evitar SQL injection.
```

---

### US-020: Implementar validador de datos dinámicos
**Como** desarrollador  
**Quiero** validar datos antes de insertarlos  
**Para** asegurar integridad de datos

**Tareas:**
- [ ] Crear `DynamicDataValidator.cs` en Application/Services
- [ ] Implementar `ValidateData(List<EntityField>, Dictionary<string, object> data)`
- [ ] Validaciones:
  - Campos requeridos presentes
  - Tipos de datos correctos
  - MaxLength para TEXT
  - Valores numéricos válidos
  - Fechas válidas
- [ ] Retornar lista de errores de validación

**Criterios de aceptación:**
- ✅ Valida que campos requeridos están presentes
- ✅ Valida que tipos coinciden (ej: NUMBER recibe número, no string)
- ✅ Valida MaxLength en campos TEXT
- ✅ Retorna lista de errores descriptivos

**Estimación:** 60 minutos

---

### US-021: Implementar DynamicCrudService
**Como** desarrollador  
**Quiero** un servicio que orqueste operaciones CRUD dinámicas  
**Para** centralizar la lógica de negocio

**Tareas:**
- [ ] Crear interface `IDynamicCrudService` en Application/Interfaces
- [ ] Crear `DynamicCrudService.cs` en Application/Services
- [ ] Inyectar IMetadataRepository, IDynamicDataRepository, DynamicQueryBuilder, DynamicDataValidator
- [ ] Implementar `GetRecordsAsync(entityId, page, pageSize)`
  - Obtener metadata de la entidad
  - Construir query SELECT con paginación
  - Ejecutar query
  - Retornar datos + metadata
- [ ] Implementar `GetRecordByIdAsync(entityId, recordId)`
- [ ] Implementar `CreateRecordAsync(entityId, data)`
  - Validar datos
  - Construir query INSERT
  - Ejecutar y retornar ID
- [ ] Implementar `UpdateRecordAsync(entityId, recordId, data)`
- [ ] Implementar `DeleteRecordAsync(entityId, recordId)`
- [ ] Registrar en DI

**Criterios de aceptación:**
- ✅ Todos los métodos funcionan correctamente
- ✅ CreateRecord valida datos antes de insertar
- ✅ Errores de validación se propagan correctamente
- ✅ GetRecords soporta paginación básica

**Estimación:** 120 minutos

**Prompt sugerido:**
```
Implementa DynamicCrudService que:
1. Use MetadataRepository para obtener definición de la entidad
2. Use DynamicDataValidator para validar datos
3. Use DynamicQueryBuilder para construir queries
4. Use DynamicDataRepository para ejecutar queries
5. Implemente paginación básica en GetRecords (LIMIT/OFFSET)
```

---

### US-022: Crear DTOs para CRUD dinámico
**Como** desarrollador  
**Quiero** DTOs para requests y responses de CRUD  
**Para** tener contratos claros

**Tareas:**
- [ ] Crear carpeta Application/DTOs/DynamicCrud
- [ ] Crear `CreateRecordRequest` (Dictionary<string, object> Data)
- [ ] Crear `UpdateRecordRequest` (Dictionary<string, object> Data)
- [ ] Crear `RecordResponse` (Guid Id, Dictionary<string, object> Data, DateTime CreatedAt)
- [ ] Crear `PagedRecordsResponse` (List<RecordResponse> Records, PaginationInfo Pagination)
- [ ] Crear `PaginationInfo` (int Page, int PageSize, int TotalRecords, int TotalPages)

**Criterios de aceptación:**
- ✅ DTOs representan correctamente los datos dinámicos
- ✅ Paginación incluye toda la info necesaria

**Estimación:** 20 minutos

---

### US-023: Crear DynamicCrudRouter con endpoints REST
**Como** usuario  
**Quiero** endpoints para hacer CRUD de registros  
**Para** gestionar datos de las entidades

**Tareas:**
- [ ] Crear `crud.py` router en `api/routers/`
- [ ] Agregar `Depends(get_current_user)` a todas las rutas
- [ ] Implementar `GET /api/entities/{entityId}/records`
  - Query params: page, pageSize (defaults: 1, 20)
- [ ] Implementar `GET /api/entities/{entityId}/records/{recordId}`
- [ ] Implementar `POST /api/entities/{entityId}/records`
- [ ] Implementar `PUT /api/entities/{entityId}/records/{recordId}`
- [ ] Implementar `DELETE /api/entities/{entityId}/records/{recordId}`
- [ ] Manejar errores y retornar status codes apropiados
- [ ] Registrar router en `main.py`
- [ ] Probar con Postman

**Criterios de aceptación:**
- ✅ Todos los endpoints funcionan
- ✅ Paginación funciona correctamente
- ✅ Validaciones retornan 400 con errores descriptivos
- ✅ Entidad no encontrada retorna 404
- ✅ Usuarios autenticados pueden acceder
- ✅ OpenAPI/Swagger documenta los endpoints automáticamente

**Estimación:** 75 minutos

**Endpoints esperados:**
```
GET    /api/entities/{entityId}/records?page=1&pageSize=20
GET    /api/entities/{entityId}/records/{recordId}
POST   /api/entities/{entityId}/records
PUT    /api/entities/{entityId}/records/{recordId}
DELETE /api/entities/{entityId}/records/{recordId}
```

---

### US-024: Implementar manejo global de errores
**Como** desarrollador  
**Quiero** un exception handler que capture excepciones  
**Para** retornar respuestas de error consistentes

**Tareas:**
- [ ] Crear `error_handler.py` en `api/middleware/`
- [ ] Crear exception handler con `@app.exception_handler`
- [ ] Capturar excepciones y logearlas
- [ ] Retornar respuestas JSON consistentes:
  ```json
  {
    "success": false,
    "error": {
      "message": "Error message",
      "details": {}
    }
  }
  ```
- [ ] Diferentes status codes según tipo de excepción
- [ ] Registrar exception handler en `main.py`
- [ ] Probar con excepción intencional

**Criterios de aceptación:**
- ✅ Excepciones no manejadas retornan 500 con mensaje genérico
- ✅ ValidationException retorna 400
- ✅ NotFoundException retorna 404
- ✅ Formato de error consistente

**Estimación:** 30 minutos

---

## 🎨 EPIC 5: Frontend - Administración de Entidades
**Objetivo:** Interfaz para que admins creen entidades y campos  
**Tiempo estimado:** 4 horas

---

### US-025: Configurar servicios de API y autenticación en frontend
**Como** desarrollador  
**Quiero** servicios para consumir el backend  
**Para** centralizar las llamadas HTTP

**Tareas:**
- [ ] Crear `src/services/api.ts` con instancia de Axios
  - Interceptor para agregar token JWT
  - Base URL configurable
- [ ] Crear `src/services/authService.ts`
  - login(), register(), logout(), getToken(), isAuthenticated()
- [ ] Crear `src/services/metadataService.ts`
  - getEntities(), getEntityById(), createEntity(), deleteEntity(), addField()
- [ ] Crear `src/hooks/useAuth.ts` con contexto de autenticación
- [ ] Crear `src/context/AuthContext.tsx`

**Criterios de aceptación:**
- ✅ Axios intercepta requests y agrega header Authorization
- ✅ Token se guarda en localStorage
- ✅ useAuth provee: user, login, logout, isAuthenticated

**Estimación:** 45 minutos

---

### US-026: Crear página de Login
**Como** usuario  
**Quiero** una pantalla de login  
**Para** autenticarme en el sistema

**Tareas:**
- [ ] Crear `src/pages/Login.tsx`
- [ ] Formulario con username y password
- [ ] Llamar a authService.login()
- [ ] Guardar token y redireccionar a dashboard
- [ ] Mostrar errores de autenticación
- [ ] Estilizar con TailwindCSS

**Criterios de aceptación:**
- ✅ Formulario funcional
- ✅ Login exitoso redirige a /dashboard
- ✅ Credenciales incorrectas muestran error
- ✅ UI responsive y profesional

**Estimación:** 30 minutos

---

### US-027: Crear layout principal con sidebar
**Como** usuario  
**Quiero** una navegación clara  
**Para** acceder a las diferentes secciones

**Tareas:**
- [ ] Crear `src/components/layout/Layout.tsx`
- [ ] Crear `src/components/layout/Sidebar.tsx`
  - Menú: Dashboard, Admin Entidades (solo admin), Entidades
- [ ] Crear `src/components/layout/Header.tsx`
  - Nombre de usuario y botón logout
- [ ] Configurar React Router con rutas protegidas
- [ ] Crear ProtectedRoute component
- [ ] Estilizar con TailwindCSS

**Criterios de aceptación:**
- ✅ Sidebar muestra opciones según rol
- ✅ Header muestra usuario actual
- ✅ Logout funciona y redirige a /login
- ✅ Rutas protegidas redirigen a login si no autenticado

**Estimación:** 45 minutos

---

### US-028: Crear pantalla de listado de entidades (Admin)
**Como** administrador  
**Quiero** ver todas las entidades creadas  
**Para** gestionarlas

**Tareas:**
- [ ] Crear `src/pages/admin/EntityManagement.tsx`
- [ ] Llamar a metadataService.getEntities()
- [ ] Mostrar tabla con: Name, Display Name, # Campos, Acciones
- [ ] Botón "Nueva Entidad"
- [ ] Botón "Ver Campos" por cada entidad
- [ ] Botón "Eliminar" con confirmación
- [ ] Estilizar con TailwindCSS

**Criterios de aceptación:**
- ✅ Lista de entidades se muestra correctamente
- ✅ Botones navegan a pantallas correspondientes
- ✅ Eliminar muestra confirmación y recarga lista
- ✅ Mensaje si no hay entidades

**Estimación:** 40 minutos

---

### US-029: Crear formulario de creación de entidad
**Como** administrador  
**Quiero** crear una nueva entidad  
**Para** definir estructuras de datos

**Tareas:**
- [ ] Crear `src/components/admin/EntityBuilder.tsx`
- [ ] Formulario con: Name, Display Name, Description
- [ ] Validaciones en frontend (campos requeridos)
- [ ] Llamar a metadataService.createEntity()
- [ ] Mostrar mensaje de éxito/error
- [ ] Redireccionar a gestión de campos después de crear
- [ ] Modal o página separada

**Criterios de aceptación:**
- ✅ Formulario valida campos requeridos
- ✅ Muestra errores de validación
- ✅ Entidad se crea correctamente
- ✅ Redirige a pantalla de campos

**Estimación:** 40 minutos

---

### US-030: Crear formulario para agregar campos a entidad
**Como** administrador  
**Quiero** agregar campos a una entidad  
**Para** definir su estructura

**Tareas:**
- [ ] Crear `src/components/admin/FieldManager.tsx`
- [ ] Mostrar entidad actual y sus campos existentes
- [ ] Formulario para nuevo campo:
  - Name, Display Name
  - Field Type (select: TEXT, NUMBER, INTEGER, DATE, BOOLEAN)
  - Is Required (checkbox)
  - Max Length (solo si tipo TEXT)
- [ ] Botón "Agregar Campo"
- [ ] Lista de campos existentes con botón eliminar
- [ ] Llamar a metadataService.addField()

**Criterios de aceptación:**
- ✅ Formulario muestra/oculta Max Length según tipo
- ✅ Campo se agrega y lista se actualiza
- ✅ Eliminar campo funciona
- ✅ Validaciones funcionan

**Estimación:** 60 minutos

**Prompt sugerido:**
```
Crea un componente React con TypeScript que:
1. Muestre lista de campos de una entidad
2. Formulario para agregar nuevo campo
3. Select de tipo de campo (TEXT, NUMBER, INTEGER, DATE, BOOLEAN)
4. Input MaxLength visible solo si tipo es TEXT
5. Use TailwindCSS para estilos
```

---

## 💼 EPIC 6: Frontend - CRUD Dinámico de Registros
**Objetivo:** Interfaz para gestionar registros de entidades  
**Tiempo estimado:** 6 horas

---

### US-031: Crear servicio y hook para CRUD dinámico
**Como** desarrollador  
**Quiero** servicios para consumir endpoints de CRUD  
**Para** interactuar con registros

**Tareas:**
- [ ] Crear `src/services/crudService.ts`
  - getRecords(entityId, page, pageSize)
  - getRecordById(entityId, recordId)
  - createRecord(entityId, data)
  - updateRecord(entityId, recordId, data)
  - deleteRecord(entityId, recordId)
- [ ] Crear `src/hooks/useDynamicEntity.ts`
  - Maneja estado de records, loading, errors
  - Funciones: loadRecords, createRecord, updateRecord, deleteRecord

**Criterios de aceptación:**
- ✅ Servicios llaman correctamente al backend
- ✅ Hook maneja estados de loading y error
- ✅ Paginación funciona

**Estimación:** 30 minutos

---

### US-032: Crear selector de entidad
**Como** usuario  
**Quiero** seleccionar una entidad  
**Para** ver y gestionar sus registros

**Tareas:**
- [ ] Crear `src/pages/entities/EntitySelector.tsx`
- [ ] Cargar lista de entidades
- [ ] Mostrar cards o lista con nombre y descripción
- [ ] Click navega a /entities/{entityId}/records

**Criterios de aceptación:**
- ✅ Muestra todas las entidades disponibles
- ✅ Click navega correctamente
- ✅ UI atractiva

**Estimación:** 30 minutos

---

### US-033: Crear tabla dinámica de registros
**Como** usuario  
**Quiero** ver todos los registros de una entidad  
**Para** consultarlos

**Tareas:**
- [ ] Crear `src/pages/entities/RecordList.tsx`
- [ ] Cargar metadata de la entidad
- [ ] Cargar registros con paginación
- [ ] Generar columnas dinámicamente según fields
- [ ] Columna de acciones: Editar, Eliminar
- [ ] Botón "Nuevo Registro"
- [ ] Paginación (anterior/siguiente)

**Criterios de aceptación:**
- ✅ Tabla muestra columnas según metadatos
- ✅ Datos se muestran correctamente según tipo
- ✅ Paginación funciona
- ✅ Botones de acción funcionan

**Estimación:** 75 minutos

**Prompt sugerido:**
```
Crea un componente React que:
1. Reciba metadata de una entidad (lista de campos con tipo)
2. Genere tabla HTML dinámicamente con columnas según los campos
3. Muestre registros (array de objetos con datos dinámicos)
4. Incluya columna de acciones (editar, eliminar)
5. Use TailwindCSS para estilos responsive
```

---

### US-034: Crear formulario dinámico para crear/editar registros
**Como** usuario  
**Quiero** un formulario que se adapte a la entidad  
**Para** crear y editar registros

**Tareas:**
- [ ] Crear `src/components/crud/DynamicForm.tsx`
- [ ] Generar inputs según tipo de campo:
  - TEXT: `<input type="text">`
  - NUMBER: `<input type="number" step="0.01">`
  - INTEGER: `<input type="number" step="1">`
  - DATE: `<input type="date">`
  - BOOLEAN: `<input type="checkbox">`
- [ ] Validaciones en frontend:
  - Campos requeridos
  - MaxLength
- [ ] Mostrar errores de validación
- [ ] Botones Guardar y Cancelar
- [ ] Modal o página separada

**Criterios de aceptación:**
- ✅ Formulario genera inputs correctos según tipo
- ✅ Validaciones frontend funcionan
- ✅ Muestra errores del backend si hay
- ✅ Guardar llama al servicio correspondiente (create o update)
- ✅ Al guardar exitosamente, cierra y recarga lista

**Estimación:** 90 minutos

---

### US-035: Implementar funcionalidad de edición
**Como** usuario  
**Quiero** editar un registro existente  
**Para** corregir datos

**Tareas:**
- [ ] Click en "Editar" carga datos del registro
- [ ] DynamicForm se llena con valores existentes
- [ ] Al guardar, llama a updateRecord
- [ ] Recarga lista después de actualizar

**Criterios de aceptación:**
- ✅ Formulario se llena con datos correctos
- ✅ Actualización funciona
- ✅ Cambios se reflejan en la tabla

**Estimación:** 30 minutos

---

### US-036: Implementar funcionalidad de eliminación
**Como** usuario  
**Quiero** eliminar un registro  
**Para** limpiar datos no necesarios

**Tareas:**
- [ ] Click en "Eliminar" muestra confirmación
- [ ] Modal de confirmación con mensaje claro
- [ ] Al confirmar, llama a deleteRecord
- [ ] Recarga lista después de eliminar
- [ ] Mostrar mensaje de éxito

**Criterios de aceptación:**
- ✅ Confirmación antes de eliminar
- ✅ Eliminación funciona
- ✅ Registro desaparece de la tabla
- ✅ Mensaje de éxito

**Estimación:** 20 minutos

---

### US-037: Mejorar UX con loading states y errores
**Como** usuario  
**Quiero** feedback visual durante operaciones  
**Para** saber qué está pasando

**Tareas:**
- [ ] Crear `src/components/common/LoadingSpinner.tsx`
- [ ] Mostrar spinner mientras carga datos
- [ ] Mostrar mensajes de error amigables
- [ ] Deshabilitar botones durante operaciones
- [ ] Toast notifications para éxito/error (opcional: usar react-toastify)

**Criterios de aceptación:**
- ✅ Loading spinner se muestra durante peticiones
- ✅ Errores se muestran de forma amigable
- ✅ Botones se deshabilitan apropiadamente

**Estimación:** 45 minutos

---

## 🚀 EPIC 7: Despliegue y Documentación
**Objetivo:** Deploy en producción y documentación completa  
**Tiempo estimado:** 2 horas

---

### US-038: Crear Dockerfile para backend
**Como** desarrollador  
**Quiero** un Dockerfile para el backend  
**Para** poder desplegarlo fácilmente

**Tareas:**
- [ ] Crear `Dockerfile` en la raíz del backend
- [ ] Multi-stage build (build y runtime)
- [ ] Exponer puerto 8000
- [ ] Probar localmente: `docker build` y `docker run`

**Criterios de aceptación:**
- ✅ Dockerfile construye correctamente
- ✅ Imagen funciona localmente
- ✅ Tamaño de imagen razonable

**Estimación:** 20 minutos

**Dockerfile básico:**
```dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=build /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### US-039: Configurar deploy en Railway o Render
**Como** desarrollador  
**Quiero** el sistema desplegado públicamente  
**Para** que los profesores puedan probarlo

**Tareas:**
- [ ] Crear cuenta en Railway (recomendado) o Render
- [ ] Crear nuevo proyecto desde GitHub
- [ ] Configurar PostgreSQL en Railway
- [ ] Configurar variables de entorno (ConnectionString, JWT secret)
- [ ] Deploy backend
- [ ] Deploy frontend (Netlify, Vercel o Railway)
- [ ] Probar que funciona end-to-end

**Criterios de aceptación:**
- ✅ Backend accesible públicamente (ej: https://xxx.railway.app)
- ✅ Frontend accesible públicamente
- ✅ Frontend puede comunicarse con backend (CORS configurado)
- ✅ Base de datos persistente

**Estimación:** 45 minutos

**Railway es más simple:**
- Detecta Python automáticamente
- PostgreSQL con un click
- Variables de entorno en UI

---

### US-040: Crear datos de demostración
**Como** evaluador  
**Quiero** datos de ejemplo  
**Para** probar el sistema fácilmente

**Tareas:**
- [ ] Crear script SQL o endpoint de seed
- [ ] Usuario admin predefinido (admin/Admin123!)
- [ ] 2-3 entidades de ejemplo:
  - Productos (nombre, precio, descripción, activo, fecha_creacion)
  - Clientes (nombre, email, telefono, fecha_registro)
  - Proyectos (titulo, descripcion, presupuesto, fecha_inicio)
- [ ] 10-15 registros de ejemplo por entidad
- [ ] Ejecutar seed al desplegar

**Criterios de aceptación:**
- ✅ Usuario admin existe
- ✅ Entidades de ejemplo creadas
- ✅ Registros de ejemplo visibles

**Estimación:** 25 minutos

---

### US-041: Crear README completo
**Como** evaluador o desarrollador  
**Quiero** documentación clara  
**Para** entender y ejecutar el proyecto

**Tareas:**
- [ ] Crear README.md en la raíz del repositorio
- [ ] Secciones:
  - Descripción del proyecto
  - Stack tecnológico
  - Arquitectura (diagrama simple)
  - Requisitos previos
  - Instalación y ejecución local
  - Variables de entorno
  - Endpoints API principales
  - Credenciales de demo
  - URL de producción
  - Capturas de pantalla
- [ ] Agregar badges (opcional): build status, etc.

**Criterios de aceptación:**
- ✅ README profesional y completo
- ✅ Instrucciones claras para correr localmente
- ✅ URL de producción visible
- ✅ Credenciales de demo incluidas

**Estimación:** 30 minutos

---

## 📊 Resumen del Backlog

### Distribución por Epic

| Epic | Descripción | User Stories | Horas |
|------|-------------|--------------|-------|
| 1 | Setup y Configuración | 5 | 2h |
| 2 | Autenticación JWT | 4 | 2h |
| 3 | Gestión de Metadatos (Backend) | 8 | 6h |
| 4 | Motor CRUD Dinámico (Backend) | 7 | 8h |
| 5 | Frontend Admin Entidades | 6 | 4h |
| 6 | Frontend CRUD Dinámico | 7 | 6h |
| 7 | Despliegue y Documentación | 4 | 2h |
| **TOTAL** | | **41** | **30h** |

### Priorización (si hay menos tiempo)

**Prioridad CRÍTICA (mínimo funcional - 24h):**
- Epic 1: Setup ✅
- Epic 2: Auth ✅
- Epic 3: Metadatos Backend ✅
- Epic 4: CRUD Backend (parcial - sin todas las validaciones) ✅
- Epic 5: Frontend Admin (básico) ✅
- Epic 6: Frontend CRUD (básico) ✅

**Prioridad MEDIA (pulir - 4h):**
- Validaciones completas
- UX mejorada
- Manejo de errores robusto

**Prioridad BAJA (nice to have - 2h):**
- Deploy profesional
- Documentación extensa
- Tests

---

## 🎯 Hitos Clave

1. **Hito 1 (4h):** Setup completo + Auth funcionando
2. **Hito 2 (10h):** Backend completo con API funcional
3. **Hito 3 (20h):** Frontend básico funcionando end-to-end
4. **Hito 4 (28h):** Sistema completo con UX pulida
5. **Hito 5 (30h):** Deploy en producción + documentación

---

## 📝 Notas para Uso con IA

**Prompts recomendados por fase:**

### Para Backend:
```
Estoy construyendo un sistema low-code en Python con FastAPI y Clean Architecture.
[Descripción de la tarea específica]
Usa SQLAlchemy ORM para metadatos y SQLAlchemy Core para queries dinámicas.
Incluye validaciones con Pydantic y manejo de errores.
```

### Para Frontend:
```
Estoy construyendo la UI de un sistema low-code con React + TypeScript + TailwindCSS.
[Descripción de la tarea específica]
Genera componentes modernos, responsive y con validaciones.
Usa hooks de React y buenas prácticas.
```

### Para SQL Dinámico:
```
Necesito construir queries SQL dinámicas en Python con SQLAlchemy Core de forma segura.
[Descripción específica]
Usa parámetros nombrados (:param) para evitar SQL injection.
Maneja tipos de datos: VARCHAR, DECIMAL, INTEGER, DATE, BOOLEAN.
Usa text() y parámetros de SQLAlchemy.
```

---

**¡Éxito con el proyecto!** 🚀


