# TK-BE-003: Crear entidad User en dominio

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-003 |
| **Tipo** | Backend |
| **Historia** | US-006 |
| **Título** | Crear clase User en capa de dominio |
| **Responsable** | Backend Developer |
| **Estimación** | XS (10 min) |
| **Dependencias** | TK-BE-001 |

## Descripción Técnica

Crear clase de dominio User separada del modelo SQLAlchemy.

## Checklist de Implementación

- [ ] Crear `backend/app/domain/entities.py`
- [ ] Definir dataclass o clase User
- [ ] Propiedades: id, username, email, password_hash, role, created_at

## Código de Referencia

```python
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
from typing import Optional

@dataclass
class User:
    id: Optional[UUID]
    username: str
    email: str
    password_hash: str
    role: str
    created_at: Optional[datetime] = None
```

## Definición de Terminado (DoD)

- [ ] Clase User creada
- [ ] Separada del modelo SQLAlchemy
