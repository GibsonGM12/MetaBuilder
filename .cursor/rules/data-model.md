# 📊 MetaBuilder - Modelo de Datos

> **Última actualización**: 26 de Febrero 2026

## Diagrama de Entidades

```
┌─────────────────┐       ┌─────────────────────┐
│     users       │       │      entities       │
├─────────────────┤       ├─────────────────────┤
│ id (UUID) PK    │       │ id (UUID) PK        │
│ username        │       │ name                │
│ email           │       │ display_name        │
│ password_hash   │       │ description         │
│ role            │       │ table_name          │
│ created_at      │       │ created_at          │
└─────────────────┘       └──────────┬──────────┘
                                     │ 1
                                     │
                                     │ N
                          ┌──────────▼──────────┐
                          │   entity_fields     │
                          ├─────────────────────┤
                          │ id (UUID) PK        │
                          │ entity_id (FK)      │
                          │ name                │
                          │ display_name        │
                          │ field_type          │
                          │ is_required         │
                          │ max_length          │
                          │ column_name         │
                          │ display_order       │
                          │ created_at          │
                          └─────────────────────┘
```

## Tablas de Metadatos

### Tabla: `entities`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Nombre técnico (snake_case) |
| `display_name` | VARCHAR(200) | NOT NULL | Nombre para mostrar |
| `description` | TEXT | NULL | Descripción de la entidad |
| `table_name` | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de tabla dinámica |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `PK_entities` en `id`
- `UQ_entities_name` en `name`
- `UQ_entities_table_name` en `table_name`

---

### Tabla: `entity_fields`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `entity_id` | UUID | FK → entities.id, NOT NULL | Entidad padre |
| `name` | VARCHAR(100) | NOT NULL | Nombre técnico del campo |
| `display_name` | VARCHAR(200) | NOT NULL | Nombre para mostrar |
| `field_type` | VARCHAR(50) | NOT NULL | Tipo de dato |
| `is_required` | BOOLEAN | DEFAULT FALSE | Campo obligatorio |
| `max_length` | INTEGER | NULL | Longitud máxima (TEXT) |
| `column_name` | VARCHAR(100) | NOT NULL | Nombre de columna en tabla |
| `display_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `PK_entity_fields` en `id`
- `FK_entity_fields_entity_id` en `entity_id`
- `UQ_entity_fields_entity_name` en (`entity_id`, `name`)

**Tipos de campo soportados**:
- `TEXT` → VARCHAR(max_length) o TEXT
- `NUMBER` → DECIMAL(18,6)
- `INTEGER` → INTEGER
- `DATE` → DATE
- `BOOLEAN` → BOOLEAN

---

## Tabla de Autenticación

### Tabla: `users`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL | Nombre de usuario |
| `email` | VARCHAR(200) | NOT NULL | Correo electrónico |
| `password_hash` | VARCHAR(500) | NOT NULL | Hash bcrypt |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'User' | Rol: 'Admin' o 'User' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Roles**:
- `Admin`: Gestiona metadatos y datos
- `User`: Solo gestiona datos (CRUD de registros)

---

## Tablas Dinámicas

### Patrón: `entity_{uuid_sin_guiones}`

Cada entidad genera una tabla con este formato (UUID sin guiones):

```sql
CREATE TABLE "entity_550e8400e29b41d4a716446655440000" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Columnas dinámicas según entity_fields
    nombre VARCHAR(100),
    precio DECIMAL(18,6),
    activo BOOLEAN
);
```

**Columnas base** (siempre presentes):
- `id` (UUID, PK)
- `created_at` (TIMESTAMP)

**Columnas dinámicas**: Agregadas según `entity_fields`

---

## Mapeo de Tipos

| field_type | PostgreSQL | Python | TypeScript |
|------------|------------|--------|------------|
| TEXT | VARCHAR/TEXT | str | string |
| NUMBER | DECIMAL(18,6) | Decimal | number |
| INTEGER | INTEGER | int | number |
| DATE | DATE | date | string (ISO) |
| BOOLEAN | BOOLEAN | bool | boolean |

---

## Tablas de Auditoría (Post-MVP)

### Tabla: `audit_log` (Futuro)

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY,
    entity_id UUID NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20), -- CREATE, UPDATE, DELETE, ROLLBACK
    user_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP
);
```

### Tabla: `entity_data_versions` (Futuro)

```sql
CREATE TABLE entity_data_versions (
    id UUID PRIMARY KEY,
    entity_id UUID NOT NULL,
    record_id UUID NOT NULL,
    version INTEGER,
    data JSONB,
    created_at TIMESTAMP
);
```

---

## SQL de Creación (Referencia)

El archivo `Database/schema.sql` contiene el SQL completo de creación.

---

> **Actualizar este archivo cuando**: Se agreguen nuevas tablas, cambien los campos de tablas existentes, o se implementen las tablas de auditoría.
