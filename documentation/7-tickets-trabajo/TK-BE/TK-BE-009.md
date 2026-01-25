# TK-BE-009: Implementar middleware de autorización JWT

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-009 |
| **Tipo** | Backend |
| **Historia** | US-009 |
| **Título** | Crear dependencias de autorización |
| **Responsable** | Backend Developer |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-BE-004, TK-BE-008 |

## Descripción Técnica

Crear dependencias FastAPI para validar JWT y roles.

## Checklist de Implementación

- [ ] Crear `backend/app/api/dependencies.py`
- [ ] Implementar `get_current_user(token) -> User`
- [ ] Implementar `get_current_admin(user) -> User`
- [ ] Extraer token de header Authorization
- [ ] Validar token con JwtService
- [ ] Verificar rol para `get_current_admin`

## Código de Referencia

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    jwt_service: JwtService = Depends(get_jwt_service)
) -> User:
    token = credentials.credentials
    payload = jwt_service.verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    # Obtener usuario de DB...
    return user

async def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
```

## Definición de Terminado (DoD)

- [ ] Request sin token retorna 401
- [ ] Token inválido retorna 401
- [ ] User accediendo a Admin retorna 403
