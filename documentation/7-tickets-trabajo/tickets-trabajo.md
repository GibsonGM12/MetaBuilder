# Tickets de Trabajo - MetaBuilder

## Resumen de Tickets por Rol

| Rol | Prefijo | Cantidad | Horas Est. |
|-----|---------|----------|------------|
| Backend Developer | TK-BE | 28 | 16h |
| Frontend Developer | TK-FE | 18 | 10h |
| Database Admin | TK-DBA | 6 | 2h |
| DevOps/Infra | TK-INFRA | 4 | 1.5h |
| QA | TK-QA | 3 | 0.5h |
| **Total** | | **59** | **30h** |

---

# ÉPICA 01: Setup y Configuración Inicial

## TK-BE-001: Crear estructura de carpetas backend

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-001 |
| **Tipo** | Backend |
| **Historia** | US-001 |
| **Título** | Crear estructura de carpetas backend con Clean Architecture |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | Ninguna |

### Descripción Técnica

Crear la estructura de directorios para el proyecto backend siguiendo Clean Architecture con 4 capas.

### Checklist de Implementación

- [ ] Crear directorio `backend/`
- [ ] Crear `backend/app/` con `__init__.py`
- [ ] Crear `backend/app/domain/` con `__init__.py`
- [ ] Crear `backend/app/application/` con `__init__.py`
- [ ] Crear `backend/app/application/services/` con `__init__.py`
- [ ] Crear `backend/app/application/dto/` con `__init__.py`
- [ ] Crear `backend/app/infrastructure/` con `__init__.py`
- [ ] Crear `backend/app/infrastructure/database/` con `__init__.py`
- [ ] Crear `backend/app/infrastructure/database/repositories/` con `__init__.py`
- [ ] Crear `backend/app/infrastructure/security/` con `__init__.py`
- [ ] Crear `backend/app/api/` con `__init__.py`
- [ ] Crear `backend/app/api/routers/` con `__init__.py`
- [ ] Crear `backend/app/api/middleware/` con `__init__.py`
- [ ] Crear `backend/tests/` con `__init__.py`

### Definición de Terminado (DoD)

- [ ] Todas las carpetas creadas con `__init__.py`
- [ ] Estructura visible en el repositorio
- [ ] No hay errores de importación al ejecutar Python

### Riesgos

- Ninguno significativo

---

## TK-BE-002: Crear requirements.txt con dependencias

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-002 |
| **Tipo** | Backend |
| **Historia** | US-001 |
| **Título** | Crear requirements.txt con dependencias del proyecto |
| **Responsable** | Backend Developer |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-BE-001 |

### Descripción Técnica

Crear archivo de dependencias con versiones fijadas para el proyecto.

### Checklist de Implementación

- [ ] Crear `backend/requirements.txt`
- [ ] Agregar FastAPI y uvicorn
- [ ] Agregar SQLAlchemy y psycopg2-binary
- [ ] Agregar Pydantic
- [ ] Agregar Alembic
- [ ] Agregar python-jose y passlib[bcrypt]
- [ ] Agregar python-multipart

### Contenido Sugerido

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

### Definición de Terminado (DoD)

- [ ] `pip install -r requirements.txt` ejecuta sin errores
- [ ] Todas las dependencias tienen versión fijada

---

## TK-INFRA-001: Crear docker-compose.yml con PostgreSQL

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-001 |
| **Tipo** | Infraestructura |
| **Historia** | US-002 |
| **Título** | Configurar Docker Compose con PostgreSQL |
| **Responsable** | DevOps |
| **Estimación** | S (10 min) |
| **Dependencias** | Ninguna |

### Descripción Técnica

Crear archivo docker-compose.yml para levantar PostgreSQL 15 con persistencia.

### Checklist de Implementación

- [ ] Crear `docker-compose.yml` en raíz del proyecto
- [ ] Configurar servicio postgres con imagen `postgres:15-alpine`
- [ ] Configurar variables de entorno (DB, USER, PASSWORD)
- [ ] Mapear puerto 5432
- [ ] Configurar volumen para persistencia
- [ ] Probar con `docker-compose up -d postgres`

### Contenido Sugerido

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: metabuilder-db
    environment:
      POSTGRES_DB: metabuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Definición de Terminado (DoD)

- [ ] `docker-compose up -d postgres` levanta el contenedor
- [ ] Conexión exitosa en localhost:5432
- [ ] Datos persisten tras reinicio

---

## TK-INFRA-002: Crear archivo .env.example

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-002 |
| **Tipo** | Infraestructura |
| **Historia** | US-002, US-004 |
| **Título** | Crear archivo .env.example con variables de entorno |
| **Responsable** | DevOps |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-INFRA-001 |

### Descripción Técnica

Crear plantilla de variables de entorno para el proyecto.

### Checklist de Implementación

- [ ] Crear `backend/.env.example`
- [ ] Documentar cada variable
- [ ] Agregar .env a .gitignore

### Contenido Sugerido

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

### Definición de Terminado (DoD)

- [ ] Archivo `.env.example` existe
- [ ] `.env` está en `.gitignore`
- [ ] Todas las variables documentadas

---

## TK-DBA-001: Configurar SQLAlchemy con PostgreSQL

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-001 |
| **Tipo** | Database |
| **Historia** | US-004 |
| **Título** | Configurar conexión SQLAlchemy a PostgreSQL |
| **Responsable** | DBA / Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-INFRA-001, TK-BE-002 |

### Descripción Técnica

Crear módulo de conexión a base de datos con SQLAlchemy.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/database.py`
- [ ] Configurar engine con connection string desde .env
- [ ] Crear SessionLocal factory
- [ ] Crear Base declarativa para modelos
- [ ] Crear función `get_db()` como dependencia FastAPI
- [ ] Probar conexión

### Código de Referencia

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

### Definición de Terminado (DoD)

- [ ] Conexión exitosa a PostgreSQL
- [ ] `get_db()` funciona como dependencia
- [ ] No hay credenciales hardcodeadas

---

## TK-DBA-002: Inicializar Alembic para migraciones

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-002 |
| **Tipo** | Database |
| **Historia** | US-004 |
| **Título** | Inicializar y configurar Alembic |
| **Responsable** | DBA |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-DBA-001 |

### Descripción Técnica

Configurar Alembic para gestión de migraciones de base de datos.

### Checklist de Implementación

- [ ] Ejecutar `alembic init alembic` en directorio backend
- [ ] Configurar `alembic/env.py` con conexión desde settings
- [ ] Configurar `alembic.ini` con connection string
- [ ] Importar Base y modelos en env.py
- [ ] Probar `alembic revision --autogenerate -m "test"`
- [ ] Eliminar migración de prueba

### Definición de Terminado (DoD)

- [ ] `alembic revision --autogenerate` funciona
- [ ] `alembic upgrade head` ejecuta sin errores
- [ ] Connection string viene de variable de entorno

---

## TK-FE-001: Crear proyecto React con Vite

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-001 |
| **Tipo** | Frontend |
| **Historia** | US-005 |
| **Título** | Crear proyecto React con Vite y TypeScript |
| **Responsable** | Frontend Developer |
| **Estimación** | S (10 min) |
| **Dependencias** | Ninguna |

### Descripción Técnica

Inicializar proyecto frontend con Vite, React 18 y TypeScript.

### Checklist de Implementación

- [ ] Ejecutar `npm create vite@latest frontend -- --template react-ts`
- [ ] Navegar a `frontend/`
- [ ] Ejecutar `npm install`
- [ ] Verificar `npm run dev` funciona

### Definición de Terminado (DoD)

- [ ] Proyecto arranca en http://localhost:5173
- [ ] TypeScript configurado correctamente
- [ ] Sin errores en consola

---

## TK-FE-002: Configurar TailwindCSS

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-002 |
| **Tipo** | Frontend |
| **Historia** | US-005 |
| **Título** | Instalar y configurar TailwindCSS |
| **Responsable** | Frontend Developer |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-FE-001 |

### Descripción Técnica

Agregar TailwindCSS al proyecto React.

### Checklist de Implementación

- [ ] Instalar: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Ejecutar: `npx tailwindcss init -p`
- [ ] Configurar `tailwind.config.js` con paths
- [ ] Agregar directivas Tailwind en `src/index.css`
- [ ] Probar con una clase de Tailwind

### Configuración tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Definición de Terminado (DoD)

- [ ] Clases de Tailwind funcionan
- [ ] Build de producción funciona

---

## TK-FE-003: Instalar dependencias adicionales frontend

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-003 |
| **Tipo** | Frontend |
| **Historia** | US-005 |
| **Título** | Instalar React Router y Axios |
| **Responsable** | Frontend Developer |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-FE-001 |

### Descripción Técnica

Instalar dependencias necesarias para routing y llamadas HTTP.

### Checklist de Implementación

- [ ] Instalar: `npm install react-router-dom axios`
- [ ] Instalar tipos si es necesario
- [ ] Verificar que compila sin errores

### Definición de Terminado (DoD)

- [ ] Dependencias instaladas
- [ ] Sin errores de TypeScript

---

# ÉPICA 02: Autenticación y Autorización JWT

## TK-DBA-003: Crear modelo y migración para tabla users

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-003 |
| **Tipo** | Database |
| **Historia** | US-006 |
| **Título** | Crear modelo SQLAlchemy y migración para users |
| **Responsable** | DBA |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-DBA-002 |

### Descripción Técnica

Crear modelo UserModel y migración Alembic para tabla users.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/models.py`
- [ ] Definir clase UserModel con SQLAlchemy
- [ ] Campos: id (UUID), username (unique), email, password_hash, role, created_at
- [ ] Generar migración: `alembic revision --autogenerate -m "create_users_table"`
- [ ] Aplicar migración: `alembic upgrade head`
- [ ] Verificar tabla en PostgreSQL

### Código de Referencia

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

### Definición de Terminado (DoD)

- [ ] Tabla users existe en PostgreSQL
- [ ] Constraint UNIQUE en username
- [ ] Índice en username

---

## TK-BE-003: Crear entidad User en dominio

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-003 |
| **Tipo** | Backend |
| **Historia** | US-006 |
| **Título** | Crear clase User en capa de dominio |
| **Responsable** | Backend Developer |
| **Estimación** | XS (10 min) |
| **Dependencias** | TK-BE-001 |

### Descripción Técnica

Crear clase de dominio User separada del modelo SQLAlchemy.

### Checklist de Implementación

- [ ] Crear `backend/app/domain/entities.py`
- [ ] Definir dataclass o clase User
- [ ] Propiedades: id, username, email, password_hash, role, created_at

### Código de Referencia

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

### Definición de Terminado (DoD)

- [ ] Clase User creada
- [ ] Separada del modelo SQLAlchemy

---

## TK-BE-004: Implementar JwtService

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-004 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de generación y validación JWT |
| **Responsable** | Backend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-BE-002 |

### Descripción Técnica

Crear servicio para generar y validar tokens JWT.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/security/jwt_service.py`
- [ ] Implementar `create_access_token(data: dict) -> str`
- [ ] Implementar `verify_token(token: str) -> dict`
- [ ] Configurar algoritmo HS256
- [ ] Configurar expiración desde settings (24h)
- [ ] Manejar excepciones de token inválido/expirado

### Código de Referencia

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

### Definición de Terminado (DoD)

- [ ] Tokens se generan correctamente
- [ ] Tokens se validan correctamente
- [ ] Tokens expirados son rechazados

---

## TK-BE-005: Implementar PasswordHasher

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-005 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de hash de passwords con bcrypt |
| **Responsable** | Backend Developer |
| **Estimación** | XS (10 min) |
| **Dependencias** | TK-BE-002 |

### Descripción Técnica

Crear utilidad para hashear y verificar passwords con bcrypt.

### Checklist de Implementación

- [ ] Agregar funciones en `jwt_service.py` o crear archivo separado
- [ ] Implementar `hash_password(password: str) -> str`
- [ ] Implementar `verify_password(plain: str, hashed: str) -> bool`
- [ ] Usar passlib con bcrypt

### Código de Referencia

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### Definición de Terminado (DoD)

- [ ] Passwords se hashean correctamente
- [ ] Verificación funciona
- [ ] Password original no es recuperable

---

## TK-BE-006: Implementar AuthService

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-006 |
| **Tipo** | Backend |
| **Historia** | US-007 |
| **Título** | Implementar servicio de autenticación |
| **Responsable** | Backend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-BE-004, TK-BE-005, TK-DBA-003 |

### Descripción Técnica

Crear AuthService que coordine registro, login y validación.

### Checklist de Implementación

- [ ] Crear `backend/app/application/services/auth_service.py`
- [ ] Implementar `register(username, email, password, role) -> User`
- [ ] Implementar `login(username, password) -> TokenResponse`
- [ ] Validar username único antes de registrar
- [ ] Hashear password antes de guardar
- [ ] Generar JWT en login exitoso

### Definición de Terminado (DoD)

- [ ] Registro crea usuario con password hasheado
- [ ] Login retorna JWT válido
- [ ] Credenciales incorrectas lanzan excepción

---

## TK-BE-007: Crear DTOs de autenticación

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-007 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear DTOs Pydantic para auth |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-002 |

### Descripción Técnica

Crear modelos Pydantic para validar requests y responses de auth.

### Checklist de Implementación

- [ ] Crear `backend/app/application/dto/auth_dto.py`
- [ ] Crear RegisterRequest (username, email, password, role)
- [ ] Crear LoginRequest (username, password)
- [ ] Crear TokenResponse (token, token_type, expires_in, user)
- [ ] Crear UserResponse (id, username, email, role)
- [ ] Agregar validaciones (min length, etc.)

### Definición de Terminado (DoD)

- [ ] DTOs validan inputs correctamente
- [ ] Errores de validación son claros

---

## TK-BE-008: Crear AuthRouter con endpoints

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-008 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear router de autenticación |
| **Responsable** | Backend Developer |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-BE-006, TK-BE-007 |

### Descripción Técnica

Crear router FastAPI con endpoints de registro y login.

### Checklist de Implementación

- [ ] Crear `backend/app/api/routers/auth.py`
- [ ] Implementar `POST /api/auth/register`
- [ ] Implementar `POST /api/auth/login`
- [ ] Inyectar AuthService como dependencia
- [ ] Manejar excepciones y retornar status codes apropiados
- [ ] Registrar router en main.py

### Definición de Terminado (DoD)

- [ ] Endpoints funcionan en Swagger
- [ ] Register retorna 201
- [ ] Login retorna 200 con token
- [ ] Credenciales incorrectas retornan 401

---

## TK-BE-009: Implementar middleware de autorización JWT

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-009 |
| **Tipo** | Backend |
| **Historia** | US-009 |
| **Título** | Crear dependencias de autorización |
| **Responsable** | Backend Developer |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-BE-004, TK-BE-008 |

### Descripción Técnica

Crear dependencias FastAPI para validar JWT y roles.

### Checklist de Implementación

- [ ] Crear `backend/app/api/dependencies.py`
- [ ] Implementar `get_current_user(token) -> User`
- [ ] Implementar `get_current_admin(user) -> User`
- [ ] Extraer token de header Authorization
- [ ] Validar token con JwtService
- [ ] Verificar rol para `get_current_admin`

### Código de Referencia

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

### Definición de Terminado (DoD)

- [ ] Request sin token retorna 401
- [ ] Token inválido retorna 401
- [ ] User accediendo a Admin retorna 403

---

## TK-BE-010: Crear main.py de FastAPI

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-010 |
| **Tipo** | Backend |
| **Historia** | US-008 |
| **Título** | Crear punto de entrada FastAPI |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-008 |

### Descripción Técnica

Crear archivo main.py con configuración de FastAPI.

### Checklist de Implementación

- [ ] Crear `backend/app/api/main.py`
- [ ] Instanciar FastAPI app con título y descripción
- [ ] Configurar CORS
- [ ] Registrar routers (auth)
- [ ] Crear endpoint de health check
- [ ] Probar con `uvicorn app.api.main:app --reload`

### Definición de Terminado (DoD)

- [ ] API arranca sin errores
- [ ] Swagger UI accesible en /docs
- [ ] CORS configurado

---

# ÉPICA 03: Gestión de Metadatos (Backend)

## TK-BE-011: Crear entidades de dominio para metadatos

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-011 |
| **Tipo** | Backend |
| **Historia** | US-010 |
| **Título** | Crear clases Entity y EntityField en dominio |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-003 |

### Descripción Técnica

Crear clases de dominio para metadatos.

### Checklist de Implementación

- [ ] Agregar clase Entity en `domain/entities.py`
- [ ] Agregar clase EntityField en `domain/entities.py`
- [ ] Crear enum FieldType (TEXT, NUMBER, INTEGER, DATE, BOOLEAN)

### Definición de Terminado (DoD)

- [ ] Clases creadas con todas las propiedades
- [ ] Enum FieldType con 5 valores

---

## TK-DBA-004: Crear modelos y migraciones para metadatos

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-004 |
| **Tipo** | Database |
| **Historia** | US-011 |
| **Título** | Crear modelos SQLAlchemy para entities y entity_fields |
| **Responsable** | DBA |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-DBA-003, TK-BE-011 |

### Descripción Técnica

Crear modelos SQLAlchemy y migración para tablas de metadatos.

### Checklist de Implementación

- [ ] Agregar EntityModel en `models.py`
- [ ] Agregar EntityFieldModel en `models.py`
- [ ] Configurar relación 1-N con cascade delete
- [ ] Configurar constraints UNIQUE
- [ ] Generar migración: `alembic revision --autogenerate -m "create_metadata_tables"`
- [ ] Aplicar migración

### Definición de Terminado (DoD)

- [ ] Tablas entities y entity_fields existen
- [ ] Relación FK configurada
- [ ] Cascade delete funciona

---

## TK-BE-012: Implementar MetadataRepository

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-012 |
| **Tipo** | Backend |
| **Historia** | US-012 |
| **Título** | Implementar repositorio de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | M (40 min) |
| **Dependencias** | TK-DBA-004 |

### Descripción Técnica

Crear repositorio con operaciones CRUD para metadatos usando SQLAlchemy ORM.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/repositories/metadata_repository.py`
- [ ] Implementar `get_all_entities()`
- [ ] Implementar `get_entity_by_id(id)` con joinedload de fields
- [ ] Implementar `create_entity(entity)`
- [ ] Implementar `update_entity(id, data)`
- [ ] Implementar `delete_entity(id)`
- [ ] Implementar `add_field(entity_id, field)`
- [ ] Implementar `delete_field(field_id)`

### Definición de Terminado (DoD)

- [ ] Todas las operaciones funcionan
- [ ] get_entity_by_id incluye campos relacionados
- [ ] Delete en cascada funciona

---

## TK-BE-013: Implementar MetadataService

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-013 |
| **Tipo** | Backend |
| **Historia** | US-013 |
| **Título** | Implementar servicio de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | L (60 min) |
| **Dependencias** | TK-BE-012 |

### Descripción Técnica

Crear servicio con lógica de negocio para gestión de metadatos.

### Checklist de Implementación

- [ ] Crear `backend/app/application/services/metadata_service.py`
- [ ] Implementar `create_entity(dto)` con validación de nombre único
- [ ] Generar table_name automáticamente como `entity_{uuid}`
- [ ] Implementar `add_field(entity_id, dto)` con validación
- [ ] Implementar métodos de lectura y eliminación
- [ ] Integrar con TableManager (siguiente ticket)

### Definición de Terminado (DoD)

- [ ] Validaciones de negocio funcionan
- [ ] table_name se genera automáticamente
- [ ] Errores descriptivos para validaciones fallidas

---

## TK-BE-014: Crear DTOs de metadatos

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-014 |
| **Tipo** | Backend |
| **Historia** | US-014 |
| **Título** | Crear DTOs Pydantic para metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | S (20 min) |
| **Dependencias** | TK-BE-011 |

### Descripción Técnica

Crear modelos Pydantic para validar requests y responses de metadatos.

### Checklist de Implementación

- [ ] Crear `backend/app/application/dto/metadata_dto.py`
- [ ] Crear CreateEntityRequest
- [ ] Crear UpdateEntityRequest
- [ ] Crear EntityResponse (con lista de fields)
- [ ] Crear AddFieldRequest
- [ ] Crear FieldResponse

### Definición de Terminado (DoD)

- [ ] DTOs validan inputs
- [ ] Mapeo a/desde entidades de dominio funciona

---

## TK-BE-015: Implementar TableManager para DDL dinámico

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-015 |
| **Tipo** | Backend |
| **Historia** | US-016 |
| **Título** | Implementar creación dinámica de tablas |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-DBA-001 |

### Descripción Técnica

Crear TableManager que ejecute CREATE TABLE y ALTER TABLE dinámicos.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/table_manager.py`
- [ ] Implementar `create_table_for_entity(table_name, fields)`
- [ ] Implementar mapeo de FieldType a tipos SQL
- [ ] Implementar `add_column(table_name, field)`
- [ ] Implementar `drop_table(table_name)`
- [ ] Usar SQLAlchemy DDL para ejecutar

### Mapeo de Tipos

```python
TYPE_MAPPING = {
    "TEXT": lambda f: f"VARCHAR({f.max_length})" if f.max_length else "TEXT",
    "NUMBER": lambda f: "DECIMAL(10,2)",
    "INTEGER": lambda f: "INTEGER",
    "DATE": lambda f: "DATE",
    "BOOLEAN": lambda f: "BOOLEAN"
}
```

### Definición de Terminado (DoD)

- [ ] CREATE TABLE genera tabla correcta
- [ ] ALTER TABLE agrega columna
- [ ] Tipos SQL mapeados correctamente

---

## TK-BE-016: Crear MetadataRouter

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-016 |
| **Tipo** | Backend |
| **Historia** | US-015 |
| **Título** | Crear router de metadatos |
| **Responsable** | Backend Developer |
| **Estimación** | M (45 min) |
| **Dependencias** | TK-BE-013, TK-BE-014, TK-BE-015 |

### Descripción Técnica

Crear router FastAPI con endpoints CRUD de metadatos.

### Checklist de Implementación

- [ ] Crear `backend/app/api/routers/metadata.py`
- [ ] Proteger con `Depends(get_current_admin)`
- [ ] Implementar GET /api/metadata/entities
- [ ] Implementar GET /api/metadata/entities/{id}
- [ ] Implementar POST /api/metadata/entities
- [ ] Implementar PUT /api/metadata/entities/{id}
- [ ] Implementar DELETE /api/metadata/entities/{id}
- [ ] Implementar POST /api/metadata/entities/{id}/fields
- [ ] Implementar DELETE /api/metadata/entities/{id}/fields/{field_id}
- [ ] Registrar router en main.py

### Definición de Terminado (DoD)

- [ ] Todos los endpoints funcionan
- [ ] Solo Admin puede acceder
- [ ] Documentación en Swagger

---

# ÉPICA 04: Motor CRUD Dinámico (Backend)

## TK-BE-017: Implementar DynamicDataRepository

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-017 |
| **Tipo** | Backend |
| **Historia** | US-018 |
| **Título** | Crear repositorio para datos dinámicos |
| **Responsable** | Backend Developer |
| **Estimación** | M (40 min) |
| **Dependencias** | TK-BE-015 |

### Descripción Técnica

Crear repositorio que ejecute queries sobre tablas dinámicas usando SQLAlchemy Core.

### Checklist de Implementación

- [ ] Crear `backend/app/infrastructure/database/repositories/dynamic_data_repository.py`
- [ ] Implementar `get_records(table_name, page, page_size)`
- [ ] Implementar `get_record_by_id(table_name, id)`
- [ ] Implementar `insert_record(table_name, data)`
- [ ] Implementar `update_record(table_name, id, data)`
- [ ] Implementar `delete_record(table_name, id)`
- [ ] Implementar `count_records(table_name)`

### Definición de Terminado (DoD)

- [ ] Operaciones CRUD funcionan
- [ ] Usa parámetros (no concatenación)
- [ ] Paginación funciona

---

## TK-BE-018: Implementar QueryBuilder

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-018 |
| **Tipo** | Backend |
| **Historia** | US-019 |
| **Título** | Implementar constructor de queries dinámicas |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-BE-017 |

### Descripción Técnica

Crear clase que construya SQL dinámico basado en metadatos.

### Checklist de Implementación

- [ ] Crear `backend/app/application/services/query_builder.py`
- [ ] Implementar `build_select_query(table, fields, page, page_size)`
- [ ] Implementar `build_insert_query(table, fields, data)`
- [ ] Implementar `build_update_query(table, fields, id, data)`
- [ ] Implementar `build_delete_query(table, id)`
- [ ] Usar SQLAlchemy text() con parámetros nombrados

### Definición de Terminado (DoD)

- [ ] Queries se generan correctamente
- [ ] Sin vulnerabilidades de SQL injection
- [ ] RETURNING id funciona en INSERT

---

## TK-BE-019: Implementar DataValidator

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-019 |
| **Tipo** | Backend |
| **Historia** | US-020 |
| **Título** | Implementar validador de datos dinámicos |
| **Responsable** | Backend Developer |
| **Estimación** | M (50 min) |
| **Dependencias** | TK-BE-011 |

### Descripción Técnica

Crear validador que verifique datos según metadatos de campos.

### Checklist de Implementación

- [ ] Crear `backend/app/application/services/data_validator.py`
- [ ] Implementar validación de campos requeridos
- [ ] Implementar validación de tipos de datos
- [ ] Implementar validación de max_length
- [ ] Retornar lista de errores descriptivos

### Definición de Terminado (DoD)

- [ ] Valida campos requeridos
- [ ] Valida tipos correctos
- [ ] Mensajes de error claros

---

## TK-BE-020: Implementar DynamicCrudService

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-020 |
| **Tipo** | Backend |
| **Historia** | US-021 |
| **Título** | Implementar servicio de CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | L (90 min) |
| **Dependencias** | TK-BE-017, TK-BE-018, TK-BE-019, TK-BE-012 |

### Descripción Técnica

Crear servicio que orqueste operaciones CRUD sobre entidades dinámicas.

### Checklist de Implementación

- [ ] Crear `backend/app/application/services/crud_service.py`
- [ ] Inyectar MetadataRepository, DynamicDataRepository, QueryBuilder, DataValidator
- [ ] Implementar `get_records(entity_id, page, page_size)`
- [ ] Implementar `get_record(entity_id, record_id)`
- [ ] Implementar `create_record(entity_id, data)` con validación
- [ ] Implementar `update_record(entity_id, record_id, data)`
- [ ] Implementar `delete_record(entity_id, record_id)`

### Definición de Terminado (DoD)

- [ ] CRUD completo funciona
- [ ] Validación se ejecuta antes de insert/update
- [ ] Errores de validación se propagan

---

## TK-BE-021: Crear DTOs de CRUD dinámico

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-021 |
| **Tipo** | Backend |
| **Historia** | US-022 |
| **Título** | Crear DTOs para CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | Ninguna |

### Descripción Técnica

Crear modelos Pydantic para requests y responses del CRUD.

### Checklist de Implementación

- [ ] Crear `backend/app/application/dto/crud_dto.py`
- [ ] Crear CreateRecordRequest (data: dict)
- [ ] Crear UpdateRecordRequest (data: dict)
- [ ] Crear RecordResponse (id, created_at, data)
- [ ] Crear PagedRecordsResponse (records, pagination)
- [ ] Crear PaginationInfo (page, page_size, total_records, total_pages)

### Definición de Terminado (DoD)

- [ ] DTOs representan datos correctamente
- [ ] Paginación tiene toda la info necesaria

---

## TK-BE-022: Crear CrudRouter

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-022 |
| **Tipo** | Backend |
| **Historia** | US-023 |
| **Título** | Crear router de CRUD dinámico |
| **Responsable** | Backend Developer |
| **Estimación** | M (45 min) |
| **Dependencias** | TK-BE-020, TK-BE-021 |

### Descripción Técnica

Crear router FastAPI con endpoints CRUD genéricos.

### Checklist de Implementación

- [ ] Crear `backend/app/api/routers/crud.py`
- [ ] Proteger con `Depends(get_current_user)`
- [ ] Implementar GET /api/entities/{entity_id}/records
- [ ] Implementar GET /api/entities/{entity_id}/records/{record_id}
- [ ] Implementar POST /api/entities/{entity_id}/records
- [ ] Implementar PUT /api/entities/{entity_id}/records/{record_id}
- [ ] Implementar DELETE /api/entities/{entity_id}/records/{record_id}
- [ ] Registrar router en main.py

### Definición de Terminado (DoD)

- [ ] Todos los endpoints funcionan
- [ ] Admin y User pueden acceder
- [ ] Paginación funciona

---

## TK-BE-023: Implementar error handler global

| Campo | Valor |
|-------|-------|
| **ID** | TK-BE-023 |
| **Tipo** | Backend |
| **Historia** | US-024 |
| **Título** | Implementar manejo global de errores |
| **Responsable** | Backend Developer |
| **Estimación** | S (20 min) |
| **Dependencias** | TK-BE-010 |

### Descripción Técnica

Crear middleware que capture excepciones y retorne respuestas consistentes.

### Checklist de Implementación

- [ ] Crear `backend/app/api/middleware/error_handler.py`
- [ ] Crear excepciones personalizadas (ValidationError, NotFoundError, etc.)
- [ ] Implementar exception handlers para cada tipo
- [ ] Formato de error consistente
- [ ] No exponer detalles internos en producción
- [ ] Registrar handlers en main.py

### Definición de Terminado (DoD)

- [ ] Errores retornan JSON consistente
- [ ] Status codes apropiados
- [ ] Errores 500 no exponen stack traces

---

# ÉPICA 05: Frontend - Administración de Entidades

## TK-FE-004: Crear estructura de carpetas frontend

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-004 |
| **Tipo** | Frontend |
| **Historia** | US-025 |
| **Título** | Crear estructura de carpetas frontend |
| **Responsable** | Frontend Developer |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-FE-001 |

### Checklist de Implementación

- [ ] Crear `src/components/`
- [ ] Crear `src/services/`
- [ ] Crear `src/hooks/`
- [ ] Crear `src/pages/`
- [ ] Crear `src/context/`
- [ ] Crear `src/types/`

---

## TK-FE-005: Crear servicio API con Axios

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-005 |
| **Tipo** | Frontend |
| **Historia** | US-025 |
| **Título** | Configurar Axios con interceptores |
| **Responsable** | Frontend Developer |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-FE-003 |

### Checklist de Implementación

- [ ] Crear `src/services/api.ts`
- [ ] Configurar baseURL desde env
- [ ] Crear interceptor para agregar token
- [ ] Crear interceptor para manejar errores 401
- [ ] Exportar instancia configurada

---

## TK-FE-006: Crear AuthContext y useAuth

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-006 |
| **Tipo** | Frontend |
| **Historia** | US-025 |
| **Título** | Implementar contexto de autenticación |
| **Responsable** | Frontend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-FE-005 |

### Checklist de Implementación

- [ ] Crear `src/context/AuthContext.tsx`
- [ ] Crear `src/hooks/useAuth.ts`
- [ ] Implementar estado: user, token, loading
- [ ] Implementar métodos: login, logout, isAuthenticated
- [ ] Persistir token en localStorage
- [ ] Cargar token al iniciar app

---

## TK-FE-007: Crear página de Login

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-007 |
| **Tipo** | Frontend |
| **Historia** | US-026 |
| **Título** | Implementar página de login |
| **Responsable** | Frontend Developer |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-FE-006 |

### Checklist de Implementación

- [ ] Crear `src/pages/Login.tsx`
- [ ] Formulario con username y password
- [ ] Validación de campos requeridos
- [ ] Llamar a login del contexto
- [ ] Mostrar errores de autenticación
- [ ] Redirigir a dashboard tras login exitoso
- [ ] Estilos con TailwindCSS

---

## TK-FE-008: Crear Layout con Sidebar

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-008 |
| **Tipo** | Frontend |
| **Historia** | US-027 |
| **Título** | Crear layout principal con navegación |
| **Responsable** | Frontend Developer |
| **Estimación** | M (35 min) |
| **Dependencias** | TK-FE-006 |

### Checklist de Implementación

- [ ] Crear `src/components/layout/Layout.tsx`
- [ ] Crear `src/components/layout/Sidebar.tsx`
- [ ] Crear `src/components/layout/Header.tsx`
- [ ] Mostrar opciones según rol
- [ ] Implementar logout en header
- [ ] Responsive design

---

## TK-FE-009: Configurar React Router

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-009 |
| **Tipo** | Frontend |
| **Historia** | US-027 |
| **Título** | Configurar routing y rutas protegidas |
| **Responsable** | Frontend Developer |
| **Estimación** | M (25 min) |
| **Dependencias** | TK-FE-006, TK-FE-007, TK-FE-008 |

### Checklist de Implementación

- [ ] Configurar BrowserRouter en App.tsx
- [ ] Crear componente ProtectedRoute
- [ ] Definir rutas: /login, /dashboard, /admin/*, /entities/*
- [ ] Redirigir a login si no autenticado
- [ ] Redirigir a dashboard si ya autenticado

---

## TK-FE-010: Crear página de listado de entidades

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-010 |
| **Tipo** | Frontend |
| **Historia** | US-028 |
| **Título** | Implementar lista de entidades (Admin) |
| **Responsable** | Frontend Developer |
| **Estimación** | M (35 min) |
| **Dependencias** | TK-FE-009 |

### Checklist de Implementación

- [ ] Crear `src/pages/admin/EntityManagement.tsx`
- [ ] Crear `src/services/metadataService.ts`
- [ ] Cargar entidades al montar
- [ ] Mostrar tabla con Name, Display Name, # Campos
- [ ] Botón "Nueva Entidad"
- [ ] Botón "Ver Campos" por entidad
- [ ] Botón "Eliminar" con confirmación

---

## TK-FE-011: Crear formulario de entidad

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-011 |
| **Tipo** | Frontend |
| **Historia** | US-029 |
| **Título** | Implementar formulario de creación de entidad |
| **Responsable** | Frontend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-FE-010 |

### Checklist de Implementación

- [ ] Crear `src/components/admin/EntityBuilder.tsx`
- [ ] Campos: name, display_name, description
- [ ] Validaciones frontend
- [ ] Llamar a API para crear
- [ ] Mostrar errores
- [ ] Redirigir a campos tras crear

---

## TK-FE-012: Crear gestor de campos

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-012 |
| **Tipo** | Frontend |
| **Historia** | US-030 |
| **Título** | Implementar gestión de campos de entidad |
| **Responsable** | Frontend Developer |
| **Estimación** | L (50 min) |
| **Dependencias** | TK-FE-011 |

### Checklist de Implementación

- [ ] Crear `src/components/admin/FieldManager.tsx`
- [ ] Mostrar campos existentes
- [ ] Formulario para agregar campo
- [ ] Select de tipos
- [ ] Mostrar/ocultar max_length según tipo
- [ ] Checkbox is_required
- [ ] Eliminar campo con confirmación

---

# ÉPICA 06: Frontend - CRUD Dinámico de Registros

## TK-FE-013: Crear servicio CRUD

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-013 |
| **Tipo** | Frontend |
| **Historia** | US-031 |
| **Título** | Implementar servicio de CRUD dinámico |
| **Responsable** | Frontend Developer |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-FE-005 |

### Checklist de Implementación

- [ ] Crear `src/services/crudService.ts`
- [ ] Implementar getRecords, getRecord, createRecord, updateRecord, deleteRecord

---

## TK-FE-014: Crear hook useDynamicEntity

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-014 |
| **Tipo** | Frontend |
| **Historia** | US-031 |
| **Título** | Implementar hook para CRUD dinámico |
| **Responsable** | Frontend Developer |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-FE-013 |

### Checklist de Implementación

- [ ] Crear `src/hooks/useDynamicEntity.ts`
- [ ] Estado: records, loading, error, pagination
- [ ] Funciones: loadRecords, createRecord, updateRecord, deleteRecord

---

## TK-FE-015: Crear selector de entidad

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-015 |
| **Tipo** | Frontend |
| **Historia** | US-032 |
| **Título** | Implementar selector de entidad |
| **Responsable** | Frontend Developer |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-FE-010 |

### Checklist de Implementación

- [ ] Crear `src/pages/entities/EntitySelector.tsx`
- [ ] Mostrar cards de entidades
- [ ] Navegar a /entities/{id}/records al seleccionar

---

## TK-FE-016: Crear tabla dinámica

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-016 |
| **Tipo** | Frontend |
| **Historia** | US-033 |
| **Título** | Implementar tabla dinámica de registros |
| **Responsable** | Frontend Developer |
| **Estimación** | L (60 min) |
| **Dependencias** | TK-FE-014, TK-FE-015 |

### Checklist de Implementación

- [ ] Crear `src/pages/entities/RecordList.tsx`
- [ ] Crear `src/components/crud/DynamicTable.tsx`
- [ ] Generar columnas desde metadatos
- [ ] Mostrar datos formateados según tipo
- [ ] Columna de acciones
- [ ] Paginación

---

## TK-FE-017: Crear formulario dinámico

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-017 |
| **Tipo** | Frontend |
| **Historia** | US-034 |
| **Título** | Implementar formulario dinámico |
| **Responsable** | Frontend Developer |
| **Estimación** | L (70 min) |
| **Dependencias** | TK-FE-016 |

### Checklist de Implementación

- [ ] Crear `src/components/crud/DynamicForm.tsx`
- [ ] Generar inputs según tipo de campo
- [ ] TEXT -> input text
- [ ] NUMBER -> input number step="0.01"
- [ ] INTEGER -> input number step="1"
- [ ] DATE -> input date
- [ ] BOOLEAN -> checkbox
- [ ] Validaciones frontend
- [ ] Modo crear y editar

---

## TK-FE-018: Implementar modal y confirmaciones

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-018 |
| **Tipo** | Frontend |
| **Historia** | US-035, US-036 |
| **Título** | Crear componentes modales |
| **Responsable** | Frontend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-FE-017 |

### Checklist de Implementación

- [ ] Crear `src/components/common/Modal.tsx`
- [ ] Modal para formulario de crear/editar
- [ ] Modal de confirmación para eliminar
- [ ] Cerrar al hacer clic fuera

---

## TK-FE-019: Implementar loading y mensajes

| Campo | Valor |
|-------|-------|
| **ID** | TK-FE-019 |
| **Tipo** | Frontend |
| **Historia** | US-037 |
| **Título** | Agregar estados de carga y mensajes |
| **Responsable** | Frontend Developer |
| **Estimación** | M (30 min) |
| **Dependencias** | TK-FE-018 |

### Checklist de Implementación

- [ ] Crear `src/components/common/LoadingSpinner.tsx`
- [ ] Mostrar spinner durante cargas
- [ ] Deshabilitar botones durante operaciones
- [ ] Mostrar mensajes de éxito/error

---

# ÉPICA 07: Deploy y Documentación

## TK-INFRA-003: Crear Dockerfile backend

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-003 |
| **Tipo** | Infraestructura |
| **Historia** | US-038 |
| **Título** | Crear Dockerfile para backend |
| **Responsable** | DevOps |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-BE-010 |

### Checklist de Implementación

- [ ] Crear `backend/Dockerfile`
- [ ] Multi-stage build
- [ ] Imagen base python:3.12-slim
- [ ] Instalar dependencias
- [ ] Exponer puerto 8000
- [ ] CMD para uvicorn

---

## TK-INFRA-004: Configurar deploy en Railway

| Campo | Valor |
|-------|-------|
| **ID** | TK-INFRA-004 |
| **Tipo** | Infraestructura |
| **Historia** | US-039 |
| **Título** | Desplegar en Railway |
| **Responsable** | DevOps |
| **Estimación** | M (40 min) |
| **Dependencias** | TK-INFRA-003 |

### Checklist de Implementación

- [ ] Crear proyecto en Railway
- [ ] Conectar repositorio GitHub
- [ ] Agregar PostgreSQL
- [ ] Configurar variables de entorno
- [ ] Deploy backend
- [ ] Deploy frontend en Vercel
- [ ] Configurar CORS para producción
- [ ] Probar end-to-end

---

## TK-DBA-005: Crear script de seeds

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-005 |
| **Tipo** | Database |
| **Historia** | US-040 |
| **Título** | Crear datos de demostración |
| **Responsable** | DBA |
| **Estimación** | M (20 min) |
| **Dependencias** | TK-DBA-004 |

### Checklist de Implementación

- [ ] Crear script SQL o Python de seeds
- [ ] Usuario admin (admin/Admin123!)
- [ ] Usuario normal (user/User123!)
- [ ] Entidad Productos con 5 campos
- [ ] Entidad Clientes con 4 campos
- [ ] 10-15 registros por entidad

---

## TK-QA-001: Pruebas de humo de API

| Campo | Valor |
|-------|-------|
| **ID** | TK-QA-001 |
| **Tipo** | QA |
| **Historia** | US-039 |
| **Título** | Ejecutar pruebas de humo |
| **Responsable** | QA |
| **Estimación** | S (15 min) |
| **Dependencias** | TK-INFRA-004 |

### Checklist de Implementación

- [ ] Probar login con admin
- [ ] Probar crear entidad
- [ ] Probar agregar campo
- [ ] Probar CRUD de registros
- [ ] Verificar que User no puede acceder a admin

---

## TK-DBA-006: Ejecutar migraciones en producción

| Campo | Valor |
|-------|-------|
| **ID** | TK-DBA-006 |
| **Tipo** | Database |
| **Historia** | US-039 |
| **Título** | Aplicar migraciones y seeds en producción |
| **Responsable** | DBA |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-DBA-005, TK-INFRA-004 |

### Checklist de Implementación

- [ ] Conectar a BD de Railway
- [ ] Ejecutar alembic upgrade head
- [ ] Ejecutar seeds
- [ ] Verificar datos

---

## TK-QA-002: Pruebas de frontend en producción

| Campo | Valor |
|-------|-------|
| **ID** | TK-QA-002 |
| **Tipo** | QA |
| **Historia** | US-039 |
| **Título** | Verificar frontend en producción |
| **Responsable** | QA |
| **Estimación** | S (10 min) |
| **Dependencias** | TK-INFRA-004, TK-DBA-006 |

### Checklist de Implementación

- [ ] Acceder a URL de producción
- [ ] Login con credenciales de demo
- [ ] Navegar por todas las secciones
- [ ] Crear un registro de prueba
- [ ] Verificar responsive en móvil

---

## TK-QA-003: Documentar bugs encontrados

| Campo | Valor |
|-------|-------|
| **ID** | TK-QA-003 |
| **Tipo** | QA |
| **Historia** | US-039 |
| **Título** | Documentar bugs y crear issues |
| **Responsable** | QA |
| **Estimación** | XS (5 min) |
| **Dependencias** | TK-QA-002 |

### Checklist de Implementación

- [ ] Listar bugs encontrados
- [ ] Crear issues en GitHub
- [ ] Priorizar por severidad

---

# Orden Sugerido de Ejecución

## Sprint 1: Setup y Auth (4h)

1. TK-BE-001, TK-BE-002 (Backend structure)
2. TK-INFRA-001, TK-INFRA-002 (Docker, env)
3. TK-DBA-001, TK-DBA-002 (SQLAlchemy, Alembic)
4. TK-FE-001, TK-FE-002, TK-FE-003 (Frontend setup)
5. TK-DBA-003, TK-BE-003 (User model)
6. TK-BE-004, TK-BE-005, TK-BE-006 (Auth services)
7. TK-BE-007, TK-BE-008, TK-BE-009, TK-BE-010 (Auth API)

## Sprint 2: Metadatos Backend (6h)

8. TK-BE-011, TK-DBA-004 (Metadata models)
9. TK-BE-012, TK-BE-013, TK-BE-014 (Metadata service)
10. TK-BE-015 (TableManager)
11. TK-BE-016 (MetadataRouter)

## Sprint 3: CRUD Backend (8h)

12. TK-BE-017, TK-BE-018 (Dynamic data repo, QueryBuilder)
13. TK-BE-019, TK-BE-020 (Validator, CrudService)
14. TK-BE-021, TK-BE-022, TK-BE-023 (DTOs, Router, Errors)

## Sprint 4: Frontend Admin (4h)

15. TK-FE-004, TK-FE-005, TK-FE-006 (Structure, API, Auth)
16. TK-FE-007, TK-FE-008, TK-FE-009 (Login, Layout, Router)
17. TK-FE-010, TK-FE-011, TK-FE-012 (Entity management)

## Sprint 5: Frontend CRUD (6h)

18. TK-FE-013, TK-FE-014, TK-FE-015 (Services, hooks)
19. TK-FE-016, TK-FE-017 (Dynamic table, form)
20. TK-FE-018, TK-FE-019 (Modals, UX)

## Sprint 6: Deploy (2h)

21. TK-INFRA-003, TK-INFRA-004 (Dockerfile, Railway)
22. TK-DBA-005, TK-DBA-006 (Seeds)
23. TK-QA-001, TK-QA-002, TK-QA-003 (Testing)

---

*Última actualización: Enero 2026*
