# EP-01: Setup y Configuración Inicial

**Objetivo**: Preparar el ambiente de desarrollo y estructura base del proyecto.  
**Tiempo estimado**: 2 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-001](US-001.md) | Configurar estructura de proyecto backend | P0 | 30 min | Ninguna |
| [US-002](US-002.md) | Configurar Docker Compose con PostgreSQL | P0 | 20 min | US-001 |
| [US-003](US-003.md) | Configurar repositorio Git | P0 | 20 min | US-001 |
| [US-004](US-004.md) | Configurar SQLAlchemy y Alembic | P0 | 30 min | US-002 |
| [US-005](US-005.md) | Configurar proyecto React con Vite y TailwindCSS | P0 | 20 min | US-003 |

---

## Flujo de Dependencias

```
US-001 (Estructura Backend)
    ├── US-002 (Docker PostgreSQL)
    │       └── US-004 (SQLAlchemy/Alembic)
    └── US-003 (Git/GitHub)
            └── US-005 (React/Vite/Tailwind)
```

---

## Tickets Relacionados

- TK-BE-001: Crear estructura de carpetas backend
- TK-BE-002: Crear requirements.txt
- TK-INFRA-001: Crear docker-compose.yml
- TK-INFRA-002: Crear .env.example
- TK-DBA-001: Configurar SQLAlchemy
- TK-DBA-002: Inicializar Alembic
- TK-FE-001: Crear proyecto React
- TK-FE-002: Configurar TailwindCSS
- TK-FE-003: Instalar dependencias
