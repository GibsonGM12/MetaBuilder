# EP-05: Frontend - Administración de Entidades

**Objetivo**: Interfaz para que admins creen entidades y campos.  
**Tiempo estimado**: 4 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-025](US-025.md) | Configurar servicios de API en frontend | P0 | 45 min | US-005, US-008 |
| [US-026](US-026.md) | Crear página de Login | P0 | 30 min | US-025 |
| [US-027](US-027.md) | Crear layout principal con sidebar | P0 | 45 min | US-026 |
| [US-028](US-028.md) | Crear pantalla de listado de entidades | P0 | 40 min | US-027 |
| [US-029](US-029.md) | Crear formulario de creación de entidad | P0 | 40 min | US-028 |
| [US-030](US-030.md) | Crear formulario para agregar campos | P0 | 60 min | US-029 |

---

## Flujo de Dependencias

```
US-005 (React/Vite)     US-008 (AuthRouter)
        └─────────┬─────────┘
                  │
            US-025 (API Services)
                  │
            US-026 (Login Page)
                  │
            US-027 (Layout/Sidebar)
                  │
            US-028 (Lista Entidades)
                  │
            US-029 (Crear Entidad)
                  │
            US-030 (Gestionar Campos)
```

---

## Tickets Relacionados

- TK-FE-004: Crear estructura carpetas frontend
- TK-FE-005: Crear servicio API con Axios
- TK-FE-006: Crear AuthContext y useAuth
- TK-FE-007: Crear página de Login
- TK-FE-008: Crear Layout con Sidebar
- TK-FE-009: Configurar React Router
- TK-FE-010: Crear página listado entidades
- TK-FE-011: Crear formulario de entidad
- TK-FE-012: Crear gestor de campos
