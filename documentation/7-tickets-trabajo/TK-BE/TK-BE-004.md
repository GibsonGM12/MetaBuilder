# TK-BE-004: Implementar JwtService

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-004 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de generación y validación JWT |
| **Responsable** | Backend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-BE-002 |

## Descripción Técnica

Crear servicio para generar y validar tokens JWT.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/security/jwt_service.py`
- [ ] Implementar `create_access_token(data: dict) -> str`
- [ ] Implementar `verify_token(token: str) -> dict`
- [ ] Configurar algoritmo HS256
- [ ] Configurar expiración desde settings (24h)
- [ ] Manejar excepciones de token inválido/expirado

## Código de Referencia

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

class JwtService:
    def __init__(self, secret_key: str, algorithm: str = "HS256", expire_hours: int = 24):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.expire_hours = expire_hours
    
    def create_access_token(self, data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(hours=self.expire_hours)
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None
```

## Definición de Terminado (DoD)

- [ ] Tokens se generan correctamente
- [ ] Tokens se validan correctamente
- [ ] Tokens expirados son rechazados
