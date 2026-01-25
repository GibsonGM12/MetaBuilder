# TK-DBA-001: Configurar SQLAlchemy con PostgreSQL

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-001 |
| **Tipo** | Database |
| **Historia** | US-004 |
| **Título** | Configurar conexión SQLAlchemy a PostgreSQL |
| **Responsable** | DBA / Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-INFRA-001, TK-BE-002 |

## Descripción Técnica

Crear módulo de conexión a base de datos con SQLAlchemy.

## Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/database.py`
- [ ] Configurar engine con connection string desde .env
- [ ] Crear SessionLocal factory
- [ ] Crear Base declarativa para modelos
- [ ] Crear función `get_db()` como dependencia FastAPI
- [ ] Probar conexión

## Código de Referencia

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/metabuilder"
    
    class Config:
        env_file = ".env"

settings = Settings()

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Definición de Terminado (DoD)

- [ ] Conexión exitosa a PostgreSQL
- [ ] `get_db()` funciona como dependencia
- [ ] No hay credenciales hardcodeadas
