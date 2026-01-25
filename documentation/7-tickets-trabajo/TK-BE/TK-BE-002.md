# TK-BE-002: Crear requirements.txt con dependencias

## Información General

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-002 |
| **Tipo** | Backend |
| **Historia** | US-001 |
| **Título** | Crear requirements.txt con dependencias del proyecto |
| **Responsable** | Backend Developer |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-BE-001 |

## Descripción Técnica

Crear archivo de dependencias con versiones fijadas para el proyecto.

## Checklist de Implementación

- [ ] Crear `backend/requirements.txt`
- [ ] Agregar FastAPI y uvicorn
- [ ] Agregar SQLAlchemy y psycopg2-binary
- [ ] Agregar Pydantic
- [ ] Agregar Alembic
- [ ] Agregar python-jose y passlib[bcrypt]
- [ ] Agregar python-multipart

## Contenido Sugerido

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
pydantic==2.5.3
pydantic-settings==2.1.0
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

## Definición de Terminado (DoD)

- [ ] `pip install -r requirements.txt` ejecuta sin errores
- [ ] Todas las dependencias tienen versión fijada
