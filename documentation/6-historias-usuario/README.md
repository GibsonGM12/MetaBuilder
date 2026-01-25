# Historias de Usuario - MetaBuilder

## Resumen del Backlog

| Épica | ID | Historias | Horas Est. | Estado |
|-------|-----|-----------|-------|--------|
| EP-01 | Setup y Configuración | US-001 a US-005 | 2h | Pendiente |
| EP-02 | Autenticación JWT | US-006 a US-009 | 2h | Pendiente |
| EP-03 | Gestión de Metadatos (BE) | US-010 a US-017 | 6h | Pendiente |
| EP-04 | Motor CRUD Dinámico (BE) | US-018 a US-024 | 8h | Pendiente |
| EP-05 | Frontend Admin | US-025 a US-030 | 4h | Pendiente |
| EP-06 | Frontend CRUD Dinámico | US-031 a US-037 | 6h | Pendiente |
| EP-07 | Deploy y Documentación | US-038 a US-041 | 2h | Pendiente |
| **Total** | | **41 historias** | **30h** | |

---

## Estructura de Carpetas

```
6-historias-usuario/
├── EP-01-Setup-Configuracion/
│   ├── US-001.md - Configurar estructura de proyecto backend
│   ├── US-002.md - Configurar Docker Compose con PostgreSQL
│   ├── US-003.md - Configurar repositorio Git
│   ├── US-004.md - Configurar SQLAlchemy y Alembic
│   └── US-005.md - Configurar proyecto React con Vite y TailwindCSS
│
├── EP-02-Autenticacion-JWT/
│   ├── US-006.md - Crear entidad User y tabla en base de datos
│   ├── US-007.md - Implementar servicio de autenticación y JWT
│   ├── US-008.md - Crear endpoints de autenticación
│   └── US-009.md - Configurar middleware de autorización
│
├── EP-03-Gestion-Metadatos/
│   ├── US-010.md - Crear entidades de dominio para metadatos
│   ├── US-011.md - Crear tablas de metadatos en base de datos
│   ├── US-012.md - Implementar MetadataRepository
│   ├── US-013.md - Implementar MetadataService con lógica de negocio
│   ├── US-014.md - Crear DTOs para metadatos
│   ├── US-015.md - Crear MetadataRouter con endpoints REST
│   ├── US-016.md - Implementar creación dinámica de tablas
│   └── US-017.md - Implementar ALTER TABLE al agregar campos
│
├── EP-04-Motor-CRUD-Dinamico/
│   ├── US-018.md - Crear repositorio de datos dinámicos
│   ├── US-019.md - Implementar DynamicQueryBuilder
│   ├── US-020.md - Implementar validador de datos dinámicos
│   ├── US-021.md - Implementar DynamicCrudService
│   ├── US-022.md - Crear DTOs para CRUD dinámico
│   ├── US-023.md - Crear CrudRouter con endpoints REST
│   └── US-024.md - Implementar manejo global de errores
│
├── EP-05-Frontend-Admin/
│   ├── US-025.md - Configurar servicios de API en frontend
│   ├── US-026.md - Crear página de Login
│   ├── US-027.md - Crear layout principal con sidebar
│   ├── US-028.md - Crear pantalla de listado de entidades
│   ├── US-029.md - Crear formulario de creación de entidad
│   └── US-030.md - Crear formulario para agregar campos
│
├── EP-06-Frontend-CRUD-Dinamico/
│   ├── US-031.md - Crear servicio y hook para CRUD dinámico
│   ├── US-032.md - Crear selector de entidad
│   ├── US-033.md - Crear tabla dinámica de registros
│   ├── US-034.md - Crear formulario dinámico para crear/editar
│   ├── US-035.md - Implementar funcionalidad de edición
│   ├── US-036.md - Implementar funcionalidad de eliminación
│   └── US-037.md - Mejorar UX con loading states y errores
│
└── EP-07-Deploy-Documentacion/
    ├── US-038.md - Crear Dockerfile para backend
    ├── US-039.md - Configurar deploy en Railway
    ├── US-040.md - Crear datos de demostración
    └── US-041.md - Crear README completo
```

---

## Mapa de Historias por Épica

```
EP-01: Setup (2h)
├── US-001: Estructura backend
├── US-002: Docker PostgreSQL
├── US-003: Git/GitHub
├── US-004: SQLAlchemy/Alembic
└── US-005: React/Vite/Tailwind

EP-02: Auth (2h)
├── US-006: Entidad User
├── US-007: AuthService + JWT
├── US-008: AuthRouter endpoints
└── US-009: Middleware autorización

EP-03: Metadatos BE (6h)
├── US-010: Entidades dominio
├── US-011: Tablas metadatos
├── US-012: MetadataRepository
├── US-013: MetadataService
├── US-014: DTOs metadatos
├── US-015: MetadataRouter
├── US-016: CREATE TABLE dinámico
└── US-017: ALTER TABLE campos

EP-04: CRUD BE (8h)
├── US-018: DynamicDataRepository
├── US-019: QueryBuilder
├── US-020: DataValidator
├── US-021: DynamicCrudService
├── US-022: DTOs CRUD
├── US-023: CrudRouter
└── US-024: Error handler

EP-05: Frontend Admin (4h)
├── US-025: Servicios API
├── US-026: Login page
├── US-027: Layout/Sidebar
├── US-028: Lista entidades
├── US-029: Crear entidad
└── US-030: Gestionar campos

EP-06: Frontend CRUD (6h)
├── US-031: CRUD service/hook
├── US-032: Selector entidad
├── US-033: Tabla dinámica
├── US-034: Formulario dinámico
├── US-035: Edición
├── US-036: Eliminación
└── US-037: UX/Loading/Errores

EP-07: Deploy (2h)
├── US-038: Dockerfile
├── US-039: Deploy Railway
├── US-040: Datos demo
└── US-041: README
```

---

*Última actualización: Enero 2026*
