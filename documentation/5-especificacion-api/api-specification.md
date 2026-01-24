# Especificación de la API - MetaBuilder

## 1. Información General

### 1.1 Datos de la API

| Campo | Valor |
|-------|-------|
| **Título** | MetaBuilder API |
| **Versión** | 1.0.0 |
| **Base URL** | `http://localhost:8000/api` (dev) / `https://api.metabuilder.railway.app/api` (prod) |
| **Documentación** | `/docs` (Swagger UI) / `/redoc` (ReDoc) |

### 1.2 Convenciones

| Aspecto | Convención |
|---------|------------|
| **Formato de respuesta** | JSON |
| **Encoding** | UTF-8 |
| **Versionado** | No versionado en MVP (futuro: `/api/v1/`) |
| **Naming** | snake_case para campos JSON |
| **IDs** | UUID v4 |
| **Fechas** | ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) |
| **Paginación** | Query params: `page`, `page_size` |

### 1.3 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PUT) |
| 201 | Created | Recurso creado (POST) |
| 204 | No Content | Eliminación exitosa (DELETE) |
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | Token inválido o ausente |
| 403 | Forbidden | Sin permisos para la operación |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

### 1.4 Formato de Respuesta Estándar

**Respuesta exitosa**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Respuesta con error**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [
      {
        "field": "name",
        "message": "Este campo es requerido"
      }
    ]
  }
}
```

---

## 2. Autenticación

### 2.1 Esquema de Autenticación

| Tipo | Bearer Token (JWT) |
|------|-------------------|
| **Header** | `Authorization: Bearer {token}` |
| **Expiración** | 24 horas |
| **Algoritmo** | HS256 |

### 2.2 Claims del Token JWT

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "username": "admin",
  "role": "Admin",
  "exp": 1706140800,
  "iat": 1706054400
}
```

---

## 3. Endpoints de Autenticación

### 3.1 Registrar Usuario

Crea un nuevo usuario en el sistema.

```yaml
POST /api/auth/register
```

**Auth requerida**: No

**Request Body**:
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@email.com",
  "password": "Password123!",
  "role": "User"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| username | string | Sí | 3-100 caracteres, único |
| email | string | Sí | Formato email válido |
| password | string | Sí | Mínimo 8 caracteres |
| role | string | Sí | "Admin" o "User" |

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "nuevo_usuario",
    "email": "usuario@email.com",
    "role": "User",
    "created_at": "2026-01-24T10:00:00Z"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 400 | Validación fallida |
| 409 | Username ya existe |

---

### 3.2 Iniciar Sesión

Autentica un usuario y retorna un token JWT.

```yaml
POST /api/auth/login
```

**Auth requerida**: No

**Request Body**:
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

| Campo | Tipo | Requerido |
|-------|------|-----------|
| username | string | Sí |
| password | string | Sí |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "admin",
      "email": "admin@metabuilder.com",
      "role": "Admin"
    }
  },
  "message": "Login exitoso"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 401 | Credenciales inválidas |

---

## 4. Endpoints de Metadatos (Admin)

> **Nota**: Todos los endpoints de metadatos requieren rol **Admin**.

### 4.1 Listar Entidades

Obtiene todas las entidades definidas en el sistema.

```yaml
GET /api/metadata/entities
```

**Auth requerida**: Sí (Admin)

**Query Parameters**:
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| include_fields | boolean | false | Incluir campos de cada entidad |

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "productos",
      "display_name": "Productos",
      "description": "Catálogo de productos",
      "table_name": "entity_a1b2c3d4e5f6",
      "created_at": "2026-01-24T10:00:00Z",
      "field_count": 5
    }
  ],
  "message": "Entidades obtenidas exitosamente"
}
```

---

### 4.2 Obtener Entidad por ID

Obtiene una entidad específica con todos sus campos.

```yaml
GET /api/metadata/entities/{entity_id}
```

**Auth requerida**: Sí (Admin)

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| entity_id | UUID | ID de la entidad |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "productos",
    "display_name": "Productos",
    "description": "Catálogo de productos",
    "table_name": "entity_a1b2c3d4e5f6",
    "created_at": "2026-01-24T10:00:00Z",
    "fields": [
      {
        "id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
        "name": "nombre",
        "display_name": "Nombre",
        "field_type": "TEXT",
        "is_required": true,
        "max_length": 200,
        "column_name": "nombre",
        "display_order": 1
      },
      {
        "id": "f2e3d4c5-b6a7-8901-fedc-ba1098765432",
        "name": "precio",
        "display_name": "Precio",
        "field_type": "NUMBER",
        "is_required": true,
        "max_length": null,
        "column_name": "precio",
        "display_order": 2
      }
    ]
  },
  "message": "Entidad obtenida exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad no encontrada |

---

### 4.3 Crear Entidad

Crea una nueva entidad y su tabla física en la base de datos.

```yaml
POST /api/metadata/entities
```

**Auth requerida**: Sí (Admin)

**Request Body**:
```json
{
  "name": "proyectos",
  "display_name": "Proyectos",
  "description": "Gestión de proyectos"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| name | string | Sí | snake_case, 3-100 chars, único |
| display_name | string | Sí | 1-200 caracteres |
| description | string | No | Texto libre |

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "name": "proyectos",
    "display_name": "Proyectos",
    "description": "Gestión de proyectos",
    "table_name": "entity_c3d4e5f6a7b8",
    "created_at": "2026-01-24T11:00:00Z",
    "fields": []
  },
  "message": "Entidad creada exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 400 | Validación fallida |
| 409 | Nombre de entidad ya existe |

---

### 4.4 Actualizar Entidad

Actualiza los datos de una entidad existente (no los campos).

```yaml
PUT /api/metadata/entities/{entity_id}
```

**Auth requerida**: Sí (Admin)

**Request Body**:
```json
{
  "display_name": "Proyectos Activos",
  "description": "Proyectos en curso"
}
```

| Campo | Tipo | Requerido |
|-------|------|-----------|
| display_name | string | No |
| description | string | No |

> **Nota**: El campo `name` no se puede modificar una vez creada la entidad.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "name": "proyectos",
    "display_name": "Proyectos Activos",
    "description": "Proyectos en curso",
    "table_name": "entity_c3d4e5f6a7b8",
    "created_at": "2026-01-24T11:00:00Z"
  },
  "message": "Entidad actualizada exitosamente"
}
```

---

### 4.5 Eliminar Entidad

Elimina una entidad y su tabla física (hard delete).

```yaml
DELETE /api/metadata/entities/{entity_id}
```

**Auth requerida**: Sí (Admin)

**Response 204**: Sin contenido

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad no encontrada |

> **Advertencia**: Esta operación elimina permanentemente la entidad, sus campos y todos los registros de datos.

---

### 4.6 Agregar Campo a Entidad

Agrega un nuevo campo a una entidad existente.

```yaml
POST /api/metadata/entities/{entity_id}/fields
```

**Auth requerida**: Sí (Admin)

**Request Body**:
```json
{
  "name": "fecha_inicio",
  "display_name": "Fecha de Inicio",
  "field_type": "DATE",
  "is_required": false,
  "max_length": null
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| name | string | Sí | snake_case, único en la entidad |
| display_name | string | Sí | 1-200 caracteres |
| field_type | string | Sí | TEXT, NUMBER, INTEGER, DATE, BOOLEAN |
| is_required | boolean | No | default: false |
| max_length | integer | No | Solo para TEXT |

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "d4e5f6a7-b8c9-0123-def0-456789012345",
    "entity_id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "name": "fecha_inicio",
    "display_name": "Fecha de Inicio",
    "field_type": "DATE",
    "is_required": false,
    "max_length": null,
    "column_name": "fecha_inicio",
    "display_order": 1,
    "created_at": "2026-01-24T11:30:00Z"
  },
  "message": "Campo agregado exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 400 | Validación fallida |
| 404 | Entidad no encontrada |
| 409 | Nombre de campo ya existe en la entidad |

---

### 4.7 Eliminar Campo de Entidad

Elimina un campo de una entidad.

```yaml
DELETE /api/metadata/entities/{entity_id}/fields/{field_id}
```

**Auth requerida**: Sí (Admin)

**Response 204**: Sin contenido

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad o campo no encontrado |

> **Nota**: Esta operación ejecuta `ALTER TABLE DROP COLUMN`. Los datos existentes en ese campo se perderán.

---

## 5. Endpoints de CRUD Dinámico

> **Nota**: Estos endpoints están disponibles para usuarios con rol **Admin** o **User**.

### 5.1 Listar Registros

Obtiene los registros de una entidad con paginación.

```yaml
GET /api/entities/{entity_id}/records
```

**Auth requerida**: Sí (Admin o User)

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| entity_id | UUID | ID de la entidad |

**Query Parameters**:
| Parámetro | Tipo | Default | Máximo | Descripción |
|-----------|------|---------|--------|-------------|
| page | integer | 1 | - | Número de página |
| page_size | integer | 20 | 100 | Registros por página |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "e5f6a7b8-c9d0-1234-ef01-567890123456",
        "created_at": "2026-01-24T10:00:00Z",
        "nombre": "Laptop Dell XPS 15",
        "descripcion": "Laptop de alta gama",
        "precio": 1299.99,
        "stock": 25,
        "activo": true
      },
      {
        "id": "f6a7b8c9-d0e1-2345-f012-678901234567",
        "created_at": "2026-01-24T10:30:00Z",
        "nombre": "Monitor LG 27\"",
        "descripcion": "Monitor 4K UHD",
        "precio": 449.99,
        "stock": 50,
        "activo": true
      }
    ],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total_records": 5,
      "total_pages": 1
    },
    "metadata": {
      "entity_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "entity_name": "productos",
      "entity_display_name": "Productos"
    }
  },
  "message": "Registros obtenidos exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad no encontrada |

---

### 5.2 Obtener Registro por ID

Obtiene un registro específico de una entidad.

```yaml
GET /api/entities/{entity_id}/records/{record_id}
```

**Auth requerida**: Sí (Admin o User)

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| entity_id | UUID | ID de la entidad |
| record_id | UUID | ID del registro |

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "e5f6a7b8-c9d0-1234-ef01-567890123456",
    "created_at": "2026-01-24T10:00:00Z",
    "nombre": "Laptop Dell XPS 15",
    "descripcion": "Laptop de alta gama con procesador Intel i7",
    "precio": 1299.99,
    "stock": 25,
    "activo": true
  },
  "message": "Registro obtenido exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad o registro no encontrado |

---

### 5.3 Crear Registro

Crea un nuevo registro en una entidad.

```yaml
POST /api/entities/{entity_id}/records
```

**Auth requerida**: Sí (Admin o User)

**Request Body**:
```json
{
  "nombre": "Teclado Mecánico RGB",
  "descripcion": "Teclado con switches Cherry MX Blue",
  "precio": 129.99,
  "stock": 100,
  "activo": true
}
```

> **Nota**: Los campos en el body corresponden a los campos definidos en la entidad. Los campos marcados como `is_required` son obligatorios.

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": "a7b8c9d0-e1f2-3456-a012-789012345678",
    "created_at": "2026-01-24T12:00:00Z",
    "nombre": "Teclado Mecánico RGB",
    "descripcion": "Teclado con switches Cherry MX Blue",
    "precio": 129.99,
    "stock": 100,
    "activo": true
  },
  "message": "Registro creado exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 400 | Validación fallida (campo requerido, tipo incorrecto) |
| 404 | Entidad no encontrada |

---

### 5.4 Actualizar Registro

Actualiza un registro existente (actualización parcial).

```yaml
PUT /api/entities/{entity_id}/records/{record_id}
```

**Auth requerida**: Sí (Admin o User)

**Request Body**:
```json
{
  "precio": 119.99,
  "stock": 85
}
```

> **Nota**: Solo se actualizan los campos enviados. Los campos no incluidos mantienen su valor actual.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "a7b8c9d0-e1f2-3456-a012-789012345678",
    "created_at": "2026-01-24T12:00:00Z",
    "nombre": "Teclado Mecánico RGB",
    "descripcion": "Teclado con switches Cherry MX Blue",
    "precio": 119.99,
    "stock": 85,
    "activo": true
  },
  "message": "Registro actualizado exitosamente"
}
```

**Errores**:
| Código | Condición |
|--------|-----------|
| 400 | Validación fallida |
| 404 | Entidad o registro no encontrado |

---

### 5.5 Eliminar Registro

Elimina un registro permanentemente (hard delete).

```yaml
DELETE /api/entities/{entity_id}/records/{record_id}
```

**Auth requerida**: Sí (Admin o User)

**Response 204**: Sin contenido

**Errores**:
| Código | Condición |
|--------|-----------|
| 404 | Entidad o registro no encontrado |

---

## 6. Endpoint de Health Check

### 6.1 Estado del Sistema

Verifica que la API esté funcionando.

```yaml
GET /api/health
```

**Auth requerida**: No

**Response 200**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-24T12:00:00Z",
  "version": "1.0.0"
}
```

---

## 7. Requisitos de Auditoría y Trazabilidad

### 7.1 Logging de Requests

Cada request se registra con:
- Timestamp
- Método HTTP
- Path
- User ID (si autenticado)
- Status code
- Duración

### 7.2 Campos de Auditoría en Datos

| Campo | Descripción |
|-------|-------------|
| `id` | UUID único del registro |
| `created_at` | Timestamp de creación |

> **Nota**: En el MVP no se incluyen campos `updated_at`, `updated_by`, `deleted_at`. Estas funcionalidades están planificadas para versiones futuras.

---

## 8. Ejemplos de Uso con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@email.com","password":"Test123!","role":"User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

### Listar entidades (requiere token)
```bash
curl -X GET http://localhost:8000/api/metadata/entities \
  -H "Authorization: Bearer {token}"
```

### Crear entidad
```bash
curl -X POST http://localhost:8000/api/metadata/entities \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"tareas","display_name":"Tareas","description":"Lista de tareas"}'
```

### Agregar campo a entidad
```bash
curl -X POST http://localhost:8000/api/metadata/entities/{entity_id}/fields \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"titulo","display_name":"Título","field_type":"TEXT","is_required":true,"max_length":200}'
```

### Crear registro
```bash
curl -X POST http://localhost:8000/api/entities/{entity_id}/records \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Mi primera tarea"}'
```

### Listar registros con paginación
```bash
curl -X GET "http://localhost:8000/api/entities/{entity_id}/records?page=1&page_size=10" \
  -H "Authorization: Bearer {token}"
```

---

## 9. Códigos de Error Personalizados

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `VALIDATION_ERROR` | Error de validación de datos | 400 |
| `INVALID_CREDENTIALS` | Credenciales de login inválidas | 401 |
| `TOKEN_EXPIRED` | Token JWT expirado | 401 |
| `TOKEN_INVALID` | Token JWT inválido | 401 |
| `FORBIDDEN` | Sin permisos para la operación | 403 |
| `ENTITY_NOT_FOUND` | Entidad no encontrada | 404 |
| `RECORD_NOT_FOUND` | Registro no encontrado | 404 |
| `FIELD_NOT_FOUND` | Campo no encontrado | 404 |
| `DUPLICATE_ENTITY` | Nombre de entidad duplicado | 409 |
| `DUPLICATE_FIELD` | Nombre de campo duplicado en entidad | 409 |
| `DUPLICATE_USERNAME` | Username ya existe | 409 |
| `INTERNAL_ERROR` | Error interno del servidor | 500 |

---

*Última actualización: Enero 2026*
