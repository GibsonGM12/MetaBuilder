# TK-INFRA-002: Crear archivo .env.example

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-002 |
| **Tipo** | Infraestructura |
| **Historia** | US-002, US-004 |
| **Título** | Crear archivo .env.example con variables de entorno |
| **Responsable** | DevOps |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-INFRA-001 |

## Descripción Técnica

Crear plantilla de variables de entorno para el proyecto.

## Checklist de Implementación

- [ ] Crear `backend/.env.example`
- [ ] Documentar cada variable
- [ ] Agregar .env a .gitignore

## Contenido Sugerido

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metabuilder

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=true
```

## Definición de Terminado (DoD)

- [ ] Archivo `.env.example` existe
- [ ] `.env` está en `.gitignore`
- [ ] Todas las variables documentadas
