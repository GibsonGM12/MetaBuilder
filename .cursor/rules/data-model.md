# 📊 MetaBuilder - Modelo de Datos

> **Última actualización**: 1 de Marzo 2026

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
└────────┬────────┘       └──────────┬──────────┘
         │                            │ 1
         │ created_by                 │
         │                            │ N
         │                   ┌────────▼──────────┐
         │                   │   entity_fields   │
         │                   ├───────────────────┤
         │                   │ id (UUID) PK      │
         │                   │ entity_id (FK)    │
         │                   │ name              │
         │                   │ display_name      │
         │                   │ field_type        │
         │                   │ ...               │
         │                   └───────────────────┘
         │
         │ 1
         │
         │ N
┌────────▼────────────┐
│     dashboards      │
├────────────────────┤
│ id (UUID) PK        │
│ name                │
│ description         │
│ is_default          │
│ layout_config(JSON) │
│ created_by (FK)     │
│ created_at          │
│ updated_at          │
└────────┬────────────┘
         │ 1
         │
         │ N
┌────────▼──────────────┐
│   dashboard_widgets   │
├──────────────────────┤
│ id (UUID) PK          │
│ dashboard_id (FK)     │
│ entity_id (FK)        │
│ widget_type          │
│ title                │
│ position (JSON)       │
│ config (JSON)         │
│ display_order        │
│ created_at           │
└──────────────────────┘

┌─────────────────┐
│   forms         │
├─────────────────┤
│ id (UUID) PK    │
│ name            │
│ description     │
│ primary_entity_id (FK entities) │
│ created_by (FK users) │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │ 1
         │ N
┌────────▼──────────────┐
│   form_sections       │
├──────────────────────┤
│ id (UUID) PK          │
│ form_id (FK forms)    │
│ section_type          │
│ entity_id (FK entities) │
│ title                 │
│ display_order         │
│ config (JSON)         │
│ created_at            │
└────────┬──────────────┘
         │ 1
         │ N
┌────────▼──────────────────┐
│   form_section_fields    │
├──────────────────────────┤
│ id (UUID) PK              │
│ section_id (FK form_sections) │
│ entity_field_id (FK entity_fields) │
│ display_order             │
│ config (JSON)             │
│ created_at                │
└──────────────────────────┘
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
- `RELATION` → UUID (columna FK lógica; requiere entrada en `entity_relationships`)

---

### Tabla: `entity_relationships`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `source_entity_id` | UUID | FK → entities.id, NOT NULL | Entidad origen (donde está el campo RELATION) |
| `target_entity_id` | UUID | FK → entities.id, NOT NULL | Entidad destino (referenciada) |
| `relationship_type` | VARCHAR(50) | NOT NULL | Tipo: MANY_TO_ONE |
| `source_field_id` | UUID | FK → entity_fields.id, NOT NULL | Campo RELATION en la entidad origen |
| `target_display_field` | VARCHAR(100) | NULL | Campo de la entidad destino para mostrar en lookup |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices**:
- `PK_entity_relationships` en `id`
- `FK_entity_relationships_source_entity` en `source_entity_id`
- `FK_entity_relationships_target_entity` en `target_entity_id`
- `FK_entity_relationships_source_field` en `source_field_id`

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

## Tablas de Dashboard

### Tabla: `dashboards`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `name` | VARCHAR(200) | NOT NULL | Nombre del dashboard |
| `description` | TEXT | NULL | Descripción |
| `is_default` | BOOLEAN | DEFAULT FALSE | Si es el dashboard por defecto |
| `layout_config` | JSONB | NULL | Configuración de layout (react-grid-layout) |
| `created_by` | UUID | FK → users.id, NULL | Usuario creador |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

---

### Tabla: `dashboard_widgets`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `dashboard_id` | UUID | FK → dashboards.id, NOT NULL | Dashboard padre |
| `entity_id` | UUID | FK → entities.id, NULL | Entidad asociada (para datos) |
| `widget_type` | VARCHAR(50) | NOT NULL | Tipo: kpi, stat, bar_chart, line_chart, pie_chart, data_grid, recent_list |
| `title` | VARCHAR(200) | NOT NULL | Título del widget |
| `position` | JSONB | NULL | Posición y tamaño (x, y, w, h) |
| `config` | JSONB | NULL | Configuración específica del widget |
| `display_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

---

## Tablas de Form Builder

### Tabla: `forms`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `name` | VARCHAR(200) | NOT NULL | Nombre del formulario |
| `description` | TEXT | NULL | Descripción |
| `primary_entity_id` | UUID | FK → entities.id, NOT NULL | Entidad principal del formulario |
| `created_by` | UUID | FK → users.id, NULL | Usuario creador |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

---

### Tabla: `form_sections`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `form_id` | UUID | FK → forms.id, NOT NULL | Formulario padre |
| `section_type` | VARCHAR(50) | NOT NULL | Tipo: FIELDS, LOOKUP, DETAIL_TABLE, CALCULATED |
| `entity_id` | UUID | FK → entities.id, NULL | Entidad asociada (para secciones de datos) |
| `title` | VARCHAR(200) | NULL | Título de la sección |
| `display_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `config` | JSONB | NULL | Configuración específica de la sección |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

---

### Tabla: `form_section_fields`

| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Identificador único |
| `section_id` | UUID | FK → form_sections.id, NOT NULL | Sección padre |
| `entity_field_id` | UUID | FK → entity_fields.id, NULL | Campo de entidad asociado |
| `display_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `config` | JSONB | NULL | Configuración específica del campo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

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
| RELATION | UUID | uuid.UUID | string (UUID) |

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
