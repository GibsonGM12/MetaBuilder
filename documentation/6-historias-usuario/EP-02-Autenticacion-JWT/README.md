# EP-02: Autenticación y Autorización JWT

**Objetivo**: Implementar sistema de usuarios y autenticación con JWT.  
**Tiempo estimado**: 2 horas

---

## Historias de Usuario

| ID | Título | Prioridad | Estimación | Dependencias |
|----|--------|-----------|------------|--------------|
| [US-006](US-006.md) | Crear entidad User y tabla en base de datos | P0 | 20 min | US-004 |
| [US-007](US-007.md) | Implementar servicio de autenticación y JWT | P0 | 45 min | US-006 |
| [US-008](US-008.md) | Crear endpoints de autenticación | P0 | 30 min | US-007 |
| [US-009](US-009.md) | Configurar middleware de autorización | P0 | 25 min | US-008 |

---

## Flujo de Dependencias

```
US-004 (SQLAlchemy/Alembic)
    └── US-006 (Entidad User)
            └── US-007 (AuthService + JWT)
                    └── US-008 (AuthRouter)
                            └── US-009 (Middleware)
```

---

## Tickets Relacionados

- TK-DBA-003: Crear modelo/migración users
- TK-BE-003: Crear entidad User en dominio
- TK-BE-004: Implementar JwtService
- TK-BE-005: Implementar PasswordHasher
- TK-BE-006: Implementar AuthService
- TK-BE-007: Crear DTOs autenticación
- TK-BE-008: Crear AuthRouter
- TK-BE-009: Implementar middleware autorización
- TK-BE-010: Crear main.py FastAPI
