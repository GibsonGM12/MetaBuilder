# Tests

## 1. Estrategia de Testing

### 1.1 Enfoque General

La estrategia de pruebas para MetaBuilder sigue un enfoque de **Pirámide de Testing**, priorizando las pruebas unitarias en la base, seguidas de pruebas de integración y finalmente pruebas end-to-end (E2E) en la cima.

Dado que el proyecto implementa **Clean Architecture** con 4 capas (Domain, Application, Infrastructure, API), la estrategia de testing se alinea con esta separación:

```
                    ┌─────────────┐
                    │    E2E      │  → Flujos completos de usuario
                    │   Tests     │
                   ─┴─────────────┴─
                  ┌─────────────────┐
                  │   Integration   │  → APIs, BD, servicios
                  │     Tests       │
                 ─┴─────────────────┴─
                ┌─────────────────────┐
                │    Unit Tests       │  → Lógica de negocio, validaciones
                │                     │
                └─────────────────────┘
```

### 1.2 Principios de Testing

| Principio | Descripción |
|-----------|-------------|
| **Aislamiento** | Cada prueba debe ser independiente y no afectar a otras |
| **Determinismo** | Las pruebas deben producir resultados consistentes |
| **Rapidez** | Las pruebas unitarias deben ejecutarse en milisegundos |
| **Legibilidad** | El código de prueba debe ser tan claro como el código de producción |
| **Mantenibilidad** | Evitar pruebas frágiles que fallen por cambios menores |

### 1.3 Estrategia por Capa de Arquitectura

| Capa | Tipo de Test Predominante | Enfoque |
|------|---------------------------|---------|
| **Domain** | Unitarias | Entidades, validaciones de dominio |
| **Application** | Unitarias + Integración | Servicios, DTOs, casos de uso |
| **Infrastructure** | Integración | Repositorios, BD, JWT |
| **API** | Integración + E2E | Endpoints, middleware, flujos completos |
| **Frontend** | Unitarias + E2E | Componentes, hooks, flujos de usuario |

---

## 2. Tipos de Pruebas

### 2.1 Pruebas Unitarias

#### Objetivo
Verificar el correcto funcionamiento de unidades individuales de código (funciones, métodos, clases) de manera aislada, sin dependencias externas.

#### Alcance

**Backend:**
- **Capa Domain:**
  - Validación de entidades (`Entity`, `EntityField`, `User`)
  - Reglas de negocio en modelos de dominio
  - Validaciones de tipos de campo (TEXT, NUMBER, INTEGER, DATE, BOOLEAN)
  
- **Capa Application:**
  - `QueryBuilder`: Construcción de SQL dinámico
  - `DataValidator`: Validación de datos según metadatos
  - DTOs: Serialización y validación con Pydantic
  - Lógica de servicios (con mocks de repositorios)

**Frontend:**
- Componentes UI (`Button`, `Input`, `Modal`)
- Hooks personalizados (`useAuth`, `useMetadata`)
- Funciones de utilidad
- Validaciones de formularios dinámicos

#### Herramientas y Frameworks Sugeridos

| Componente | Framework | Librerías Adicionales |
|------------|-----------|----------------------|
| **Backend (Python)** | pytest | pytest-cov, pytest-mock, factory-boy |
| **Frontend (React)** | Jest | React Testing Library, @testing-library/hooks |

#### Ejemplo de Estructura de Test Unitario (Backend)

```python
# tests/unit/application/test_query_builder.py
import pytest
from app.application.services.query_builder import QueryBuilder
from app.domain.entities import Entity, EntityField, FieldType

class TestQueryBuilder:
    def test_build_insert_query_with_required_fields(self):
        """Verifica que se genere SQL INSERT correcto para campos requeridos"""
        entity = Entity(
            id="123",
            name="productos",
            table_name="entity_123"
        )
        fields = [
            EntityField(name="nombre", field_type=FieldType.TEXT, is_required=True),
            EntityField(name="precio", field_type=FieldType.NUMBER, is_required=True)
        ]
        data = {"nombre": "Laptop", "precio": 999.99}
        
        query, params = QueryBuilder.build_insert(entity, fields, data)
        
        assert "INSERT INTO entity_123" in query
        assert "nombre" in query
        assert "precio" in query
        assert params["nombre"] == "Laptop"
        assert params["precio"] == 999.99
```

#### Ejemplo de Estructura de Test Unitario (Frontend)

```typescript
// src/components/common/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('debe renderizar con el texto correcto', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('debe ejecutar onClick al hacer clic', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Guardar</Button>);
    fireEvent.click(screen.getByText('Guardar'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debe estar deshabilitado cuando loading es true', () => {
    render(<Button loading>Guardar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

### 2.2 Pruebas de Integración

#### Objetivo
Verificar la correcta interacción entre múltiples componentes del sistema, incluyendo la comunicación con servicios externos como la base de datos.

#### Alcance

**Backend:**
- **API Endpoints:**
  - Autenticación (`/api/auth/register`, `/api/auth/login`)
  - Metadatos (`/api/metadata/entities`, `/api/metadata/entities/{id}/fields`)
  - CRUD dinámico (`/api/entities/{entityId}/records`)
  
- **Repositorios:**
  - `MetadataRepository`: Operaciones CRUD sobre entidades y campos
  - `DynamicDataRepository`: Queries dinámicas sobre tablas generadas
  - `TableManager`: Creación y modificación de tablas dinámicas (DDL)

- **Servicios con dependencias:**
  - `AuthService` con `JwtService` y repositorio de usuarios
  - `MetadataService` con `TableManager` y repositorio
  - `DynamicCrudService` con `QueryBuilder` y repositorio

**Frontend:**
- Integración de servicios API con componentes
- Flujos de autenticación completos
- Interacción entre hooks y contextos

#### Herramientas y Frameworks Sugeridos

| Componente | Framework | Librerías Adicionales |
|------------|-----------|----------------------|
| **Backend API** | pytest + FastAPI TestClient | httpx, pytest-asyncio |
| **Base de Datos** | pytest | testcontainers-python, SQLAlchemy |
| **Frontend** | Jest + MSW | Mock Service Worker (msw) |

#### Ejemplo de Test de Integración (API)

```python
# tests/integration/api/test_metadata_endpoints.py
import pytest
from fastapi.testclient import TestClient
from app.api.main import app

class TestMetadataEndpoints:
    @pytest.fixture(autouse=True)
    def setup(self, test_db, admin_token):
        self.client = TestClient(app)
        self.headers = {"Authorization": f"Bearer {admin_token}"}
    
    def test_create_entity_success(self):
        """Verifica creación de entidad y tabla dinámica"""
        payload = {
            "name": "clientes",
            "display_name": "Clientes",
            "description": "Gestión de clientes"
        }
        
        response = self.client.post(
            "/api/metadata/entities",
            json=payload,
            headers=self.headers
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "clientes"
        assert data["table_name"].startswith("entity_")
        
    def test_add_field_creates_column(self, test_entity):
        """Verifica que agregar campo hace ALTER TABLE"""
        payload = {
            "name": "email",
            "display_name": "Correo Electrónico",
            "field_type": "TEXT",
            "is_required": True,
            "max_length": 200
        }
        
        response = self.client.post(
            f"/api/metadata/entities/{test_entity.id}/fields",
            json=payload,
            headers=self.headers
        )
        
        assert response.status_code == 201
```

#### Ejemplo de Test de Integración (Repositorio)

```python
# tests/integration/infrastructure/test_dynamic_data_repository.py
import pytest
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository

class TestDynamicDataRepository:
    def test_insert_and_retrieve_record(self, db_session, test_entity_with_fields):
        """Verifica inserción y recuperación de registro dinámico"""
        repo = DynamicDataRepository(db_session)
        entity = test_entity_with_fields
        
        # Insertar registro
        record_data = {
            "nombre": "Producto Test",
            "precio": 150.00,
            "activo": True
        }
        record_id = repo.insert(entity, record_data)
        
        # Recuperar registro
        retrieved = repo.get_by_id(entity, record_id)
        
        assert retrieved is not None
        assert retrieved["nombre"] == "Producto Test"
        assert retrieved["precio"] == 150.00
        assert retrieved["activo"] is True
```

---

### 2.3 Pruebas End-to-End (E2E)

#### Objetivo
Validar flujos completos de usuario desde la interfaz hasta la base de datos, simulando el comportamiento real del sistema en un entorno lo más cercano posible a producción.

#### Alcance

**Flujos críticos a probar:**

| Flujo | Descripción | Actor |
|-------|-------------|-------|
| **Autenticación** | Registro, login, logout, persistencia de sesión | Admin/User |
| **Gestión de Entidades** | Crear entidad, agregar campos, editar, eliminar | Admin |
| **CRUD Dinámico** | Crear, listar, editar, eliminar registros | Admin/User |
| **Navegación** | Sidebar, rutas protegidas, redirecciones | Todos |
| **Validaciones** | Formularios dinámicos con validación según metadatos | Admin/User |

**Escenarios E2E prioritarios:**

1. **Flujo Admin completo:**
   - Login como admin
   - Crear nueva entidad "Productos"
   - Agregar campos (nombre, precio, stock, activo)
   - Crear registros de prueba
   - Verificar listado con datos correctos
   - Editar un registro
   - Eliminar un registro

2. **Flujo Usuario:**
   - Login como usuario
   - Seleccionar entidad existente
   - Ver listado de registros
   - Crear nuevo registro
   - Intentar acceder a admin (debe rechazar)

3. **Flujo de Validaciones:**
   - Crear registro con campo requerido vacío (debe fallar)
   - Crear registro con tipo incorrecto (debe fallar)
   - Crear registro válido (debe éxito)

#### Herramientas y Frameworks Sugeridos

| Componente | Framework | Características |
|------------|-----------|-----------------|
| **E2E Frontend** | Playwright | Cross-browser, auto-wait, screenshots |
| **E2E Frontend (alternativa)** | Cypress | DevX excelente, time-travel debugging |
| **E2E API** | pytest + httpx | Tests de contrato API |

#### Ejemplo de Test E2E (Playwright)

```typescript
// e2e/tests/admin-entity-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Flujo Admin - Gestión de Entidades', () => {
  test.beforeEach(async ({ page }) => {
    // Login como admin
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'admin');
    await page.fill('[data-testid="password"]', 'admin123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('debe crear entidad con campos y registros', async ({ page }) => {
    // Navegar a gestión de entidades
    await page.click('[data-testid="menu-entities"]');
    await page.click('[data-testid="create-entity"]');
    
    // Crear entidad
    await page.fill('[data-testid="entity-name"]', 'productos');
    await page.fill('[data-testid="entity-display-name"]', 'Productos');
    await page.click('[data-testid="save-entity"]');
    
    await expect(page.locator('[data-testid="entity-created-toast"]')).toBeVisible();
    
    // Agregar campo
    await page.click('[data-testid="add-field"]');
    await page.fill('[data-testid="field-name"]', 'nombre');
    await page.selectOption('[data-testid="field-type"]', 'TEXT');
    await page.check('[data-testid="field-required"]');
    await page.click('[data-testid="save-field"]');
    
    // Verificar campo agregado
    await expect(page.locator('text=nombre')).toBeVisible();
    
    // Crear registro
    await page.click('[data-testid="menu-records"]');
    await page.selectOption('[data-testid="entity-selector"]', 'productos');
    await page.click('[data-testid="create-record"]');
    await page.fill('[data-testid="field-nombre"]', 'Laptop HP');
    await page.click('[data-testid="save-record"]');
    
    // Verificar registro en listado
    await expect(page.locator('text=Laptop HP')).toBeVisible();
  });
});
```

---

### 2.4 Pruebas de Regresión

#### Objetivo
Asegurar que cambios nuevos en el código no introduzcan defectos en funcionalidades existentes que previamente funcionaban correctamente.

#### Alcance

Las pruebas de regresión en MetaBuilder cubren:

| Área | Elementos a Verificar |
|------|----------------------|
| **APIs existentes** | Contratos de respuesta, códigos HTTP, estructura JSON |
| **Autenticación** | Flujo JWT, validación de tokens, expiración |
| **CRUD Metadatos** | Creación/edición/eliminación de entidades y campos |
| **CRUD Dinámico** | Operaciones sobre tablas dinámicas |
| **Validaciones** | Reglas de campos requeridos, tipos de datos |
| **UI Components** | Componentes reutilizables, formularios dinámicos |

#### Estrategia de Regresión

1. **Suite de Smoke Tests:**
   - Ejecutar antes de cada merge a `main`
   - Verificar funcionalidades críticas en < 5 minutos
   
2. **Suite de Regresión Completa:**
   - Ejecutar en CI/CD después de cada PR
   - Incluir todos los tests unitarios e integración

3. **Regresión Visual (opcional):**
   - Capturas de pantalla de componentes clave
   - Comparación automática de cambios visuales

#### Herramientas y Frameworks Sugeridos

| Propósito | Herramienta |
|-----------|-------------|
| **Ejecución de suites** | pytest (backend), Jest (frontend) |
| **Regresión visual** | Playwright visual comparisons, Percy |
| **Contratos API** | pytest con esquemas JSON |

#### Ejemplo de Test de Regresión (Contrato API)

```python
# tests/regression/test_api_contracts.py
import pytest
from jsonschema import validate

ENTITY_RESPONSE_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "display_name", "table_name", "created_at"],
    "properties": {
        "id": {"type": "string", "format": "uuid"},
        "name": {"type": "string"},
        "display_name": {"type": "string"},
        "description": {"type": ["string", "null"]},
        "table_name": {"type": "string", "pattern": "^entity_"},
        "created_at": {"type": "string", "format": "date-time"},
        "fields": {
            "type": "array",
            "items": {"$ref": "#/definitions/field"}
        }
    }
}

class TestApiContracts:
    def test_get_entity_response_contract(self, client, admin_token, test_entity):
        """Verifica que la respuesta de GET /entities/{id} cumple el contrato"""
        response = client.get(
            f"/api/metadata/entities/{test_entity.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        validate(instance=response.json(), schema=ENTITY_RESPONSE_SCHEMA)
```

---

## 3. Cobertura y Calidad

### 3.1 Métricas de Cobertura

#### Objetivos de Cobertura por Capa

| Capa | Cobertura Mínima | Cobertura Objetivo | Justificación |
|------|------------------|-------------------|---------------|
| **Domain** | 90% | 95% | Lógica de negocio crítica |
| **Application (Services)** | 80% | 90% | Casos de uso principales |
| **Application (DTOs)** | 70% | 80% | Validaciones Pydantic |
| **Infrastructure** | 70% | 80% | Integración con BD |
| **API** | 75% | 85% | Endpoints y middleware |
| **Frontend (Components)** | 70% | 80% | Componentes reutilizables |
| **Frontend (Hooks)** | 80% | 90% | Lógica de estado |
| **Global** | 75% | 85% | Promedio del proyecto |

#### Métricas Clave a Monitorear

| Métrica | Descripción | Herramienta |
|---------|-------------|-------------|
| **Line Coverage** | Porcentaje de líneas ejecutadas | pytest-cov, jest --coverage |
| **Branch Coverage** | Porcentaje de ramas condicionales | pytest-cov, jest --coverage |
| **Function Coverage** | Porcentaje de funciones testeadas | pytest-cov, jest --coverage |
| **Mutation Score** | Efectividad de tests (mutantes eliminados) | mutmut (Python), Stryker (JS) |

#### Configuración de Cobertura (Backend)

```ini
# pytest.ini
[pytest]
addopts = --cov=app --cov-report=html --cov-report=term-missing --cov-fail-under=75
testpaths = tests

# .coveragerc
[coverage:run]
source = app
omit = 
    app/infrastructure/database/migrations/*
    app/__init__.py
    */__pycache__/*

[coverage:report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise NotImplementedError
```

#### Configuración de Cobertura (Frontend)

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### 3.2 Criterios de Aceptación

#### Criterios para Merge a Main

| Criterio | Requisito | Bloqueante |
|----------|-----------|------------|
| **Tests unitarios** | 100% pasando | Sí |
| **Tests integración** | 100% pasando | Sí |
| **Cobertura global** | ≥ 75% | Sí |
| **Sin errores de linting** | 0 errores | Sí |
| **Sin vulnerabilidades críticas** | 0 críticas | Sí |
| **Tests E2E críticos** | 100% pasando | Sí |

#### Criterios de Calidad de Código

| Aspecto | Herramienta | Umbral |
|---------|-------------|--------|
| **Complejidad ciclomática** | radon (Python), ESLint | < 10 por función |
| **Duplicación de código** | pylint, ESLint | < 5% |
| **Deuda técnica** | SonarQube (opcional) | < 30 min |
| **Type coverage** | mypy (Python), TypeScript | 100% strict |

---

## 4. Automatización

### 4.1 Integración con CI/CD

#### Pipeline de GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ============================================
  # BACKEND TESTS
  # ============================================
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: metabuilder_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          
      - name: Install dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
          
      - name: Run linting
        working-directory: ./backend
        run: |
          ruff check .
          mypy app/
          
      - name: Run unit tests
        working-directory: ./backend
        run: |
          pytest tests/unit -v --cov=app --cov-report=xml
          
      - name: Run integration tests
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/metabuilder_test
          JWT_SECRET_KEY: test-secret-key
        run: |
          pytest tests/integration -v --cov=app --cov-report=xml --cov-append
          
      - name: Check coverage threshold
        working-directory: ./backend
        run: |
          coverage report --fail-under=75
          
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend

  # ============================================
  # FRONTEND TESTS
  # ============================================
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Run linting
        working-directory: ./frontend
        run: npm run lint
        
      - name: Run type check
        working-directory: ./frontend
        run: npm run type-check
        
      - name: Run unit tests
        working-directory: ./frontend
        run: npm run test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  # ============================================
  # E2E TESTS
  # ============================================
  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: metabuilder_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install backend dependencies
        working-directory: ./backend
        run: pip install -r requirements.txt
        
      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Install Playwright
        working-directory: ./frontend
        run: npx playwright install --with-deps chromium
        
      - name: Start backend server
        working-directory: ./backend
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/metabuilder_test
          JWT_SECRET_KEY: test-secret-key
        run: |
          alembic upgrade head
          uvicorn app.main:app --host 0.0.0.0 --port 8000 &
          sleep 5
          
      - name: Start frontend server
        working-directory: ./frontend
        env:
          VITE_API_URL: http://localhost:8000/api
        run: |
          npm run build
          npm run preview &
          sleep 5
          
      - name: Run E2E tests
        working-directory: ./frontend
        run: npx playwright test --project=chromium
        
      - name: Upload E2E report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### 4.2 Ejecución de Tests

#### Comandos de Ejecución Local

##### Backend (Python/pytest)

```bash
# Ejecutar todos los tests
cd backend
pytest

# Tests unitarios solamente
pytest tests/unit -v

# Tests de integración solamente
pytest tests/integration -v

# Con cobertura
pytest --cov=app --cov-report=html

# Test específico
pytest tests/unit/application/test_query_builder.py -v

# Smoke tests (rápidos, críticos)
pytest -m smoke -v

# Watch mode (con pytest-watch)
ptw -- --last-failed
```

##### Frontend (Jest/Playwright)

```bash
# Tests unitarios con Jest
cd frontend
npm run test

# Watch mode
npm run test:watch

# Con cobertura
npm run test:coverage

# Tests E2E con Playwright
npm run test:e2e

# E2E en modo UI (debugging)
npm run test:e2e:ui

# E2E solo chromium
npx playwright test --project=chromium

# E2E test específico
npx playwright test admin-flow.spec.ts
```

#### Scripts de package.json (Frontend)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

#### Estructura de Directorios de Tests

```
backend/
├── tests/
│   ├── conftest.py                 # Fixtures globales
│   ├── unit/
│   │   ├── domain/
│   │   │   └── test_entities.py
│   │   └── application/
│   │       ├── test_query_builder.py
│   │       └── test_data_validator.py
│   ├── integration/
│   │   ├── api/
│   │   │   ├── test_auth_endpoints.py
│   │   │   ├── test_metadata_endpoints.py
│   │   │   └── test_crud_endpoints.py
│   │   └── infrastructure/
│   │       ├── test_metadata_repository.py
│   │       └── test_dynamic_data_repository.py
│   └── regression/
│       └── test_api_contracts.py

frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       └── __tests__/
│   │           └── Button.test.tsx
│   └── hooks/
│       └── __tests__/
│           └── useAuth.test.ts
└── e2e/
    ├── tests/
    │   ├── auth-flow.spec.ts
    │   ├── admin-entity-flow.spec.ts
    │   └── crud-flow.spec.ts
    └── playwright.config.ts
```

---

## 5. Suposiciones

Dado que el archivo `funcionalidad_core.md` establece que el MVP incluye "solo smoke tests" y tests unitarios extensivos están fuera del scope de las 30 horas del proyecto, se han realizado las siguientes suposiciones para esta documentación de estrategia de testing:

| # | Suposición | Justificación |
|---|------------|---------------|
| 1 | **Cobertura incremental**: La cobertura del 75% es un objetivo post-MVP | El MVP prioriza funcionalidad sobre cobertura exhaustiva |
| 2 | **Playwright para E2E**: Se asume Playwright sobre Cypress por mejor soporte cross-browser y TypeScript nativo | Alineación con stack TypeScript del frontend |
| 3 | **pytest como framework principal**: Se infiere del uso de Python 3.12 y FastAPI | Es el estándar de facto para testing en Python |
| 4 | **Base de datos de test separada**: Se usará PostgreSQL en contenedor para tests de integración | Evita contaminar datos de desarrollo |
| 5 | **GitHub Actions como CI/CD**: Basado en la mención de "GitHub Actions (básico)" en el stack DevOps | Configuración detallada expandida para testing |
| 6 | **Fixtures con factory-boy**: Para generar datos de prueba consistentes | Patrón común en proyectos Python/SQLAlchemy |
| 7 | **MSW para mocks de API en frontend**: Para simular respuestas de backend en tests de componentes | Mejor práctica actual para React Testing |
| 8 | **Mutation testing opcional**: No es requisito del MVP pero se menciona como métrica de calidad avanzada | Útil para evaluar efectividad de tests |
| 9 | **Sin tests de carga en MVP**: Performance testing queda fuera del alcance inicial | Coherente con limitación de 30 horas |
| 10 | **Tests de seguridad básicos**: Solo validación de JWT y autorización por roles | Auditorías de seguridad avanzadas post-MVP |

---

*Última actualización: Enero 2026*
