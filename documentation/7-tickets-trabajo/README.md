# Tickets de Trabajo - MetaBuilder

## Resumen de Tickets por Rol

| Rol | Prefijo | Cantidad | Horas Est. |
|-----|---------|----------|------------|
| Backend Developer | TK-BE | 23 | 16h |
| Frontend Developer | TK-FE | 19 | 10h |
| Database Admin | TK-DBA | 6 | 2h |
| DevOps/Infra | TK-INFRA | 4 | 1.5h |
| QA | TK-QA | 3 | 0.5h |
| **Total** | | **55** | **30h** |

---

## Estructura de Carpetas

```
7-tickets-trabajo/
├── TK-BE/                    # Backend (23 tickets)
│   ├── TK-BE-001.md         # Crear estructura de carpetas backend
│   ├── TK-BE-002.md         # Crear requirements.txt
│   ├── TK-BE-003.md         # Crear entidad User en dominio
│   ├── TK-BE-004.md         # Implementar JwtService
│   ├── TK-BE-005.md         # Implementar PasswordHasher
│   ├── TK-BE-006.md         # Implementar AuthService
│   ├── TK-BE-007.md         # Crear DTOs de autenticación
│   ├── TK-BE-008.md         # Crear AuthRouter
│   ├── TK-BE-009.md         # Implementar middleware autorización
│   ├── TK-BE-010.md         # Crear main.py de FastAPI
│   ├── TK-BE-011.md         # Crear entidades de dominio para metadatos
│   ├── TK-BE-012.md         # Implementar MetadataRepository
│   ├── TK-BE-013.md         # Implementar MetadataService
│   ├── TK-BE-014.md         # Crear DTOs de metadatos
│   ├── TK-BE-015.md         # Implementar TableManager DDL dinámico
│   ├── TK-BE-016.md         # Crear MetadataRouter
│   ├── TK-BE-017.md         # Implementar DynamicDataRepository
│   ├── TK-BE-018.md         # Implementar QueryBuilder
│   ├── TK-BE-019.md         # Implementar DataValidator
│   ├── TK-BE-020.md         # Implementar DynamicCrudService
│   ├── TK-BE-021.md         # Crear DTOs CRUD dinámico
│   ├── TK-BE-022.md         # Crear CrudRouter
│   └── TK-BE-023.md         # Implementar error handler global
│
├── TK-FE/                    # Frontend (19 tickets)
│   ├── TK-FE-001.md         # Crear proyecto React con Vite
│   ├── TK-FE-002.md         # Configurar TailwindCSS
│   ├── TK-FE-003.md         # Instalar dependencias adicionales
│   ├── TK-FE-004.md         # Crear estructura de carpetas
│   ├── TK-FE-005.md         # Crear servicio API con Axios
│   ├── TK-FE-006.md         # Crear AuthContext y useAuth
│   ├── TK-FE-007.md         # Crear página de Login
│   ├── TK-FE-008.md         # Crear Layout con Sidebar
│   ├── TK-FE-009.md         # Configurar React Router
│   ├── TK-FE-010.md         # Crear página listado entidades
│   ├── TK-FE-011.md         # Crear formulario de entidad
│   ├── TK-FE-012.md         # Crear gestor de campos
│   ├── TK-FE-013.md         # Crear servicio CRUD
│   ├── TK-FE-014.md         # Crear hook useDynamicEntity
│   ├── TK-FE-015.md         # Crear selector de entidad
│   ├── TK-FE-016.md         # Crear tabla dinámica
│   ├── TK-FE-017.md         # Crear formulario dinámico
│   ├── TK-FE-018.md         # Implementar modal y confirmaciones
│   └── TK-FE-019.md         # Implementar loading y mensajes
│
├── TK-DBA/                   # Database Admin (6 tickets)
│   ├── TK-DBA-001.md        # Configurar SQLAlchemy con PostgreSQL
│   ├── TK-DBA-002.md        # Inicializar Alembic para migraciones
│   ├── TK-DBA-003.md        # Crear modelo/migración tabla users
│   ├── TK-DBA-004.md        # Crear modelos/migraciones metadatos
│   ├── TK-DBA-005.md        # Crear script de seeds
│   └── TK-DBA-006.md        # Ejecutar migraciones en producción
│
├── TK-INFRA/                 # Infraestructura (4 tickets)
│   ├── TK-INFRA-001.md      # Crear docker-compose.yml PostgreSQL
│   ├── TK-INFRA-002.md      # Crear archivo .env.example
│   ├── TK-INFRA-003.md      # Crear Dockerfile backend
│   └── TK-INFRA-004.md      # Configurar deploy en Railway
│
└── TK-QA/                    # Quality Assurance (3 tickets)
    ├── TK-QA-001.md         # Pruebas de humo de API
    ├── TK-QA-002.md         # Pruebas frontend en producción
    └── TK-QA-003.md         # Documentar bugs encontrados
```

---

## Orden Sugerido de Ejecución

### Sprint 1: Setup y Auth (4h)

1. TK-BE-001, TK-BE-002 (Backend structure)
2. TK-INFRA-001, TK-INFRA-002 (Docker, env)
3. TK-DBA-001, TK-DBA-002 (SQLAlchemy, Alembic)
4. TK-FE-001, TK-FE-002, TK-FE-003 (Frontend setup)
5. TK-DBA-003, TK-BE-003 (User model)
6. TK-BE-004, TK-BE-005, TK-BE-006 (Auth services)
7. TK-BE-007, TK-BE-008, TK-BE-009, TK-BE-010 (Auth API)

### Sprint 2: Metadatos Backend (6h)

8. TK-BE-011, TK-DBA-004 (Metadata models)
9. TK-BE-012, TK-BE-013, TK-BE-014 (Metadata service)
10. TK-BE-015 (TableManager)
11. TK-BE-016 (MetadataRouter)

### Sprint 3: CRUD Backend (8h)

12. TK-BE-017, TK-BE-018 (Dynamic data repo, QueryBuilder)
13. TK-BE-019, TK-BE-020 (Validator, CrudService)
14. TK-BE-021, TK-BE-022, TK-BE-023 (DTOs, Router, Errors)

### Sprint 4: Frontend Admin (4h)

15. TK-FE-004, TK-FE-005, TK-FE-006 (Structure, API, Auth)
16. TK-FE-007, TK-FE-008, TK-FE-009 (Login, Layout, Router)
17. TK-FE-010, TK-FE-011, TK-FE-012 (Entity management)

### Sprint 5: Frontend CRUD (6h)

18. TK-FE-013, TK-FE-014, TK-FE-015 (Services, hooks)
19. TK-FE-016, TK-FE-017 (Dynamic table, form)
20. TK-FE-018, TK-FE-019 (Modals, UX)

### Sprint 6: Deploy (2h)

21. TK-INFRA-003, TK-INFRA-004 (Dockerfile, Railway)
22. TK-DBA-005, TK-DBA-006 (Seeds)
23. TK-QA-001, TK-QA-002, TK-QA-003 (Testing)

---

*Última actualización: Enero 2026*
