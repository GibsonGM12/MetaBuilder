# TK-DBA-003: Crear modelo y migración para tabla users

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-003 |
| **Tipo** | Database |
| **Historia** | US-006 |
| **Título** | Crear modelo SQLAlchemy y migración para users |
| **Responsable** | DBA |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-DBA-002 |

## Descripción Técnica

Crear modelo UserModel y migración Alembic para tabla users.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/models.py`
- [ ] Definir clase UserModel con SQLAlchemy
- [ ] Campos: id (UUID), username (unique), email, password_hash, role, created_at
- [ ] Generar migración: `alembic revision --autogenerate -m "create_users_table"`
- [ ] Aplicar migración: `alembic upgrade head`
- [ ] Verificar tabla en PostgreSQL

## Código de Referencia

```python
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .database import Base

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(200), nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
```

## Definición de Terminado (DoD)

- [ ] Tabla users existe en PostgreSQL
- [ ] Constraint UNIQUE en username
- [ ] Índice en username
