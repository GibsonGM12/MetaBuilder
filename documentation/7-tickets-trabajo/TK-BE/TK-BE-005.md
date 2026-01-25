# TK-BE-005: Implementar PasswordHasher

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-005 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de hash de passwords con bcrypt |
| **Responsable** | Backend Developer |
| **Estimación** | XS (10 min) |
| **Dependencias** | TK-BE-002 |

## Descripción Técnica

Crear utilidad para hashear y verificar passwords con bcrypt.

## Checklist de Implementación

- [ ] Agregar funciones en `jwt_service.py` o crear archivo separado
- [ ] Implementar `hash_password(password: str) -> str`
- [ ] Implementar `verify_password(plain: str, hashed: str) -> bool`
- [ ] Usar passlib con bcrypt

## Código de Referencia

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

## Definición de Terminado (DoD)

- [ ] Passwords se hashean correctamente
- [ ] Verificación funciona
- [ ] Password original no es recuperable
