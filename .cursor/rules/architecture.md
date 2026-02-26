# 🏗️ MetaBuilder - Arquitectura y Decisiones

> **Última actualización**: 26 de Febrero 2026

## Arquitectura General

MetaBuilder utiliza una **Arquitectura en Capas (Clean Architecture)** con 4 capas principales:

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│  - Componentes genéricos                │
│  - Admin de metadatos                   │
│  - CRUD dinámico                        │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────┐
│      API Layer (FastAPI)                │
│  - Routers genéricos                    │
│  - Validación con Pydantic              │
│  - Autenticación/Authorización          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Application Layer (Services)         │
│  - MetadataService                      │
│  - DynamicCrudService                   │
│  - AuthService                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Domain Layer (Core Business)       │
│  - Entidades de dominio                 │
│  - Lógica de metadatos                  │
│  - Validadores                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Infrastructure Layer (Data Access)   │
│  - MetadataRepository (ORM)             │
│  - DynamicDataRepository (Core)         │
│  - TableManager (DDL dinámico)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         PostgreSQL Database             │
│  - Tablas de metadatos                  │
│  - Tablas dinámicas                     │
└─────────────────────────────────────────┘
```

## Decisiones Arquitectónicas (ADRs)

### ADR-001: Tablas Dinámicas vs EAV

**Decisión**: Usar **tablas dinámicas por entidad** (`entity_{uuid}`)

**Contexto**: 
- Alternativa: Entity-Attribute-Value (EAV) con una sola tabla para todos los datos

**Razones**:
- ✅ Mejor rendimiento en queries
- ✅ Índices nativos de PostgreSQL
- ✅ Tipos de datos nativos (no todo es string)
- ✅ Integridad referencial más clara
- ❌ Requiere DDL dinámico (complejidad adicional)

**Consecuencias**:
- Se necesita un `TableManager` para crear/modificar tablas dinámicamente
- Las migraciones de metadatos son automáticas, no vía Alembic

---

### ADR-002: SQLAlchemy ORM + Core

**Decisión**: Usar **SQLAlchemy ORM para metadatos** y **SQLAlchemy Core para queries dinámicas**

**Contexto**:
- ORM facilita el trabajo con entidades fijas (entities, entity_fields, users)
- Core permite construir queries sin modelos predefinidos

**Razones**:
- ✅ ORM da productividad para entidades conocidas
- ✅ Core permite flexibilidad para tablas dinámicas
- ✅ Ambos comparten el mismo engine y transacciones

**Código típico**:
```python
# ORM para metadatos (async)
stmt = select(EntityModel).where(EntityModel.id == id).options(selectinload(EntityModel.fields))
result = await session.execute(stmt)

# Core para datos dinámicos (text queries)
sql = text(f'SELECT * FROM "{table_name}" WHERE id = :id')
result = await session.execute(sql, {"id": record_id})
```

---

### ADR-003: JWT Simple sin Keycloak

**Decisión**: Usar **JWT simple con python-jose** en lugar de Keycloak para el MVP

**Contexto**:
- Keycloak es robusto pero complejo de configurar
- MVP necesita autenticación funcional rápida

**Razones**:
- ✅ Implementación más rápida (~2h vs ~8h)
- ✅ Sin dependencias externas adicionales
- ✅ Suficiente para MVP con 2 roles
- ❌ No tiene refresh tokens avanzados
- ❌ No tiene SSO out-of-the-box

**Post-MVP**: Evaluar migración a Keycloak cuando se necesiten:
- Múltiples proveedores de identidad
- SSO empresarial
- Gestión avanzada de sesiones

---

### ADR-004: Hard Delete en MVP

**Decisión**: Usar **hard delete** (eliminación física) en el MVP

**Contexto**:
- Soft delete requiere filtros en todas las queries
- Añade complejidad al CRUD genérico

**Razones**:
- ✅ Simplifica implementación
- ✅ Queries más limpias
- ❌ No hay recuperación de datos eliminados

**Post-MVP**: Implementar soft delete con campo `deleted_at` y versionado

---

### ADR-005: Nomenclatura de Tablas Dinámicas

**Decisión**: Las tablas dinámicas se nombran `entity_{uuid}`

**Ejemplo**: `entity_550e8400-e29b-41d4-a716-446655440000`

**Razones**:
- ✅ UUIDs evitan colisiones de nombres
- ✅ No depende del nombre legible de la entidad
- ✅ Seguro para caracteres especiales en nombres

---

### ADR-007: bcrypt directo en lugar de passlib.CryptContext

**Decisión**: Usar **bcrypt.hashpw/checkpw directamente** en lugar de passlib.context.CryptContext

**Contexto**:
- passlib.CryptContext tenía conflictos de compatibilidad con la librería bcrypt
- Error: `ValueError: password cannot be longer than 72 bytes`

**Razones**:
- ✅ Elimina capa de abstracción innecesaria
- ✅ Resuelve incompatibilidad entre passlib y bcrypt
- ✅ API simple: `bcrypt.hashpw()` y `bcrypt.checkpw()`

---

### ADR-006: Validación en Dos Capas

**Decisión**: Validar en **frontend** y **backend**

**Frontend**:
- Validación inmediata para UX
- Basada en metadatos de campos

**Backend**:
- Validación autoritativa
- Protege contra requests maliciosas
- `DataValidator` valida tipos y required

---

## Flujos Principales

### Flujo: Crear Nueva Entidad

```
1. Admin → POST /api/entities {name, display_name, description}
2. MetadataService valida datos
3. MetadataRepository guarda en tabla `entities`
4. TableManager ejecuta: CREATE TABLE entity_{uuid} (id UUID, created_at...)
5. Respuesta: Entidad creada con id
```

### Flujo: Agregar Campo a Entidad

```
1. Admin → POST /api/entities/{id}/fields {name, field_type, is_required...}
2. MetadataService valida que entidad existe
3. MetadataRepository guarda en tabla `entity_fields`
4. TableManager ejecuta: ALTER TABLE entity_{uuid} ADD COLUMN {column_name} {type}
5. Respuesta: Campo creado
```

### Flujo: CRUD Dinámico

```
1. User → POST /api/entities/{entity_id}/records {"data": {campo1: valor1, campo2: valor2}}
2. DynamicCrudService obtiene metadatos de la entidad (MetadataRepository)
3. DataValidator valida valores contra definición de campos (tipos, requeridos, max_length)
4. DataValidator convierte tipos (fechas str→date, mapea field.name→column_name)
5. DynamicDataRepository ejecuta INSERT con text() sobre tabla entity_{uuid}
6. _build_response serializa Decimal→float, date→ISO string
7. Respuesta: RecordResponse {id, created_at, data}
```

---

## Patrones de Código

Ver archivo `patterns.md` para convenciones de código específicas.

---

> **Actualizar este archivo cuando**: Se tome una nueva decisión arquitectónica importante, se cambie alguna decisión existente, o se agreguen nuevos flujos principales.
