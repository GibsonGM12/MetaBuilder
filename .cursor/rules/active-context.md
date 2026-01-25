# 🎯 MetaBuilder - Contexto Activo

> **Última actualización**: 24 de Enero 2026

## Estado Actual de la Sesión

### Trabajo en Curso

| Campo | Valor |
|-------|-------|
| **Épica activa** | Ninguna (Pre-implementación) |
| **Ticket actual** | Ninguno |
| **Archivos modificados** | Memory Bank creado |
| **Bloqueadores** | Ninguno |

### Próxima Tarea

**Ticket**: TK-BE-001 - Crear estructura de carpetas backend

**Descripción**: Crear la estructura de directorios del proyecto backend siguiendo el patrón de Clean Architecture.

**Estructura a crear**:
```
backend/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── routers/
│   │       └── __init__.py
│   ├── core/
│   │   └── __init__.py
│   ├── domain/
│   │   ├── __init__.py
│   │   └── entities/
│   │       └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   └── infrastructure/
│       ├── __init__.py
│       └── repositories/
│           └── __init__.py
├── alembic/
├── tests/
│   └── __init__.py
└── requirements.txt
```

---

## Contexto Técnico Relevante

### Decisiones Tomadas Esta Sesión

- Ninguna aún (sesión de configuración inicial)

### Problemas Encontrados

- Ninguno

### Notas de Implementación

- El proyecto está en fase de documentación completa
- Toda la arquitectura y diseño están definidos
- Se debe seguir el orden de tickets para implementación

---

## Archivos Clave para el Trabajo Actual

### Backend (a crear)
- `backend/app/main.py` - Punto de entrada FastAPI
- `backend/app/core/config.py` - Configuración
- `backend/requirements.txt` - Dependencias

### Frontend (a crear)
- `frontend/src/App.tsx` - Componente principal
- `frontend/vite.config.ts` - Configuración Vite

### Documentación (existente)
- `documentation/7-tickets-trabajo/` - Tickets detallados
- `documentation/5-especificacion-api/` - Especificación de API
- `documentation/3-arquitectura/` - Arquitectura detallada

---

## Estructura de Carpetas Actual

```
MetaBuilder/
├── .cursor/
│   └── rules/           # Memory Bank (recién creado)
├── Database/
│   └── schema.sql
├── Diagrams/
├── documentation/       # Documentación completa
├── Examples/
├── Prompts/
├── Project.md
├── README.md
└── funcionalidad_core.md
```

---

## Comandos Útiles

### Docker (cuando esté configurado)
```bash
# Levantar ambiente de desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f backend
```

### Backend (cuando esté configurado)
```bash
# Crear ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload
```

### Frontend (cuando esté configurado)
```bash
# Instalar dependencias
npm install

# Ejecutar dev server
npm run dev
```

---

## Checklist de Inicio de Sesión

- [ ] Leer `progress.md` para ver estado actual
- [ ] Identificar ticket a trabajar
- [ ] Revisar documentación del ticket en `documentation/7-tickets-trabajo/`
- [ ] Implementar ticket
- [ ] Actualizar `progress.md` al completar
- [ ] Actualizar este archivo con contexto relevante

---

> **Actualizar este archivo cuando**: Se inicie una nueva tarea, se encuentren problemas, se tomen decisiones técnicas, o se complete una sesión de trabajo.
