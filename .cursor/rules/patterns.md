# 📐 MetaBuilder - Patrones y Convenciones

> **Última actualización**: 1 de Marzo 2026

## Convenciones de Nomenclatura

### Python (Backend)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | snake_case | `auth_service.py` |
| Clases | PascalCase | `AuthService` |
| Funciones | snake_case | `create_user()` |
| Variables | snake_case | `user_id` |
| Constantes | UPPER_SNAKE_CASE | `JWT_SECRET_KEY` |
| Módulos privados | _prefijo | `_internal.py` |

### TypeScript (Frontend)

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos componentes | PascalCase.tsx | `LoginPage.tsx` |
| Archivos utils | camelCase.ts | `apiService.ts` |
| Componentes | PascalCase | `LoginPage` |
| Funciones | camelCase | `fetchEntities()` |
| Variables | camelCase | `userId` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Interfaces | PascalCase con I | `IUser` o `User` |
| Types | PascalCase | `UserRole` |

### Base de Datos

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Tablas | snake_case plural | `users`, `entities` |
| Columnas | snake_case | `created_at` |
| Primary Keys | `id` | `id UUID` |
| Foreign Keys | `{tabla}_id` | `entity_id` |
| Índices | `IX_{tabla}_{columnas}` | `IX_users_email` |
| Unique | `UQ_{tabla}_{columna}` | `UQ_entities_name` |

---

## Patrones de Código

### Backend - Estructura de Router (patrón real)

```python
# app/api/routers/crud.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.application.dto.crud_dto import PaginatedResponse, RecordCreate, RecordResponse
from app.application.services.crud_service import DynamicCrudService
from app.core.database import get_db
from app.infrastructure.database.repositories.dynamic_data_repository import DynamicDataRepository
from app.infrastructure.database.repositories.metadata_repository import MetadataRepository

router = APIRouter(prefix="/api/entities", tags=["records"])

async def _get_crud_service(db: AsyncSession = Depends(get_db)) -> DynamicCrudService:
    return DynamicCrudService(MetadataRepository(db), DynamicDataRepository(db))

@router.post("/{entity_id}/records", response_model=RecordResponse, status_code=201)
async def create_record(
    entity_id: UUID,
    payload: RecordCreate,
    service: DynamicCrudService = Depends(_get_crud_service),
    _user: dict = Depends(get_current_user),
):
    return await service.create_record(entity_id, payload)
```

### Backend - Estructura de Service (patrón real)

```python
# app/application/services/crud_service.py
class DynamicCrudService:
    def __init__(self, meta_repo: MetadataRepository, data_repo: DynamicDataRepository):
        self._meta = meta_repo
        self._data = data_repo

    async def create_record(self, entity_id: uuid.UUID, payload: RecordCreate) -> RecordResponse:
        entity = await self._get_entity_or_404(entity_id)
        cleaned = validate_record(entity.fields, payload.data)
        result = await self._data.insert_record(entity.table_name, cleaned)
        full_row = await self._data.get_record(entity.table_name, result["id"])
        return self._build_response(full_row, entity.fields)
```

### Backend - Estructura de Repository (patrón real - async)

```python
# app/infrastructure/database/repositories/metadata_repository.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

class MetadataRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def create_entity(self, entity: EntityModel) -> EntityModel:
        self._session.add(entity)
        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def get_entity_by_id(self, entity_id: UUID) -> EntityModel | None:
        stmt = (
            select(EntityModel)
            .where(EntityModel.id == entity_id)
            .options(selectinload(EntityModel.fields))
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()
```

### Backend - Estructura de DTO/Schema (patrón real - Pydantic v2)

```python
# app/application/dto/metadata_dto.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime

class EntityCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None

class EntityResponse(BaseModel):
    id: UUID
    name: str
    display_name: str
    description: str | None
    table_name: str
    created_at: datetime
    fields: list[FieldResponse] = []

    model_config = {"from_attributes": True}
```

---

### Frontend - Estructura de Componente (patrón real con React Query)

```tsx
// src/pages/EntityRecords.tsx - usa hooks de React Query
import { useEntities, useEntity } from "../hooks/useMetadata";
import { useRecords, useCreateRecord } from "../hooks/useCrud";

export function EntityRecords() {
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const { data: entities } = useEntities();
  const { data: entity } = useEntity(selectedEntityId || undefined);
  const { data: recordsData } = useRecords(selectedEntityId || undefined, page, pageSize);

  const createMutation = useCreateRecord(selectedEntityId);
  const handleCreate = async (data: Record<string, unknown>) => {
    await createMutation.mutateAsync(data);
  };
  // ...
}
```

### Frontend - Estructura de Service (patrón real)

```tsx
// src/services/crudService.ts
import { api } from "./api";
import type { DynamicRecord, PaginatedRecords } from "../types";

export const crudService = {
  getRecords: async (entityId: string, page: number = 1, pageSize: number = 20): Promise<PaginatedRecords> => {
    const response = await api.get(`/api/entities/${entityId}/records?page=${page}&page_size=${pageSize}`);
    return response.data;
  },
  createRecord: async (entityId: string, data: Record<string, unknown>): Promise<DynamicRecord> => {
    const response = await api.post(`/api/entities/${entityId}/records`, { data });
    return response.data;
  },
};
```

### Frontend - Estructura de Hook con React Query (patrón real)

```tsx
// src/hooks/useCrud.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudService } from "../services/crudService";

export function useRecords(entityId: string | undefined, page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ["records", entityId, page, pageSize],
    queryFn: () => crudService.getRecords(entityId!, page, pageSize),
    enabled: !!entityId,
  });
}

export function useCreateRecord(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => crudService.createRecord(entityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
    },
  });
}
```

---

### Section Renderer Pattern (Frontend - Form Builder)

Switch por `section_type` para renderizar el componente correcto (similar a Widget Renderer):

```tsx
// Form Renderer - switch por section_type
switch (section.section_type) {
  case "FIELDS":
    return <FieldsSection section={section} ... />;
  case "LOOKUP":
    return <LookupSection section={section} ... />;
  case "DETAIL_TABLE":
    return <DetailTableSection section={section} ... />;
  case "CALCULATED":
    return <CalculatedSection section={section} ... />;
  default:
    return null;
}
```

---

### Multi-entity Submission Pattern (Backend)

Para formularios que crean registros en múltiples tablas (cabecera + detalle):

```python
# FormSubmissionService - una sola transacción
async def submit_form(self, form_id: UUID, payload: dict) -> dict:
    async with self._session.begin():  # Transacción única
        header_record = await self._create_header_record(...)
        for line in payload.get("lines", []):
            await self._create_detail_record(header_record["id"], line)
        # Commit implícito al salir del bloque; rollback si hay excepción
    return result
```

---

### Widget Renderer Pattern (Frontend)

Switch por `widget_type` para renderizar el componente correcto:

```tsx
// src/components/dashboard/widgets/WidgetRenderer.tsx
export function WidgetRenderer({ widget, entityId }: Props) {
  switch (widget.widget_type) {
    case "kpi":
      return <KpiCard widget={widget} entityId={entityId} />;
    case "stat":
      return <StatCard widget={widget} entityId={entityId} />;
    case "bar_chart":
      return <BarChartWidget widget={widget} entityId={entityId} />;
    case "line_chart":
      return <LineChartWidget widget={widget} entityId={entityId} />;
    case "pie_chart":
      return <PieChartWidget widget={widget} entityId={entityId} />;
    case "data_grid":
      return <DataGridWidget widget={widget} entityId={entityId} />;
    case "recent_list":
      return <RecentListWidget widget={widget} entityId={entityId} />;
    default:
      return <WidgetError message={`Tipo desconocido: ${widget.widget_type}`} />;
  }
}
```

---

### RELATION Field Pattern

Al agregar un campo de tipo `RELATION`:
1. El sistema crea una entrada en `entity_relationships` (source_entity_id, target_entity_id, source_field_id, relationship_type, target_display_field)
2. Se agrega una columna UUID en la tabla dinámica correspondiente (nombre basado en el campo)

### Lookup Pattern

Para campos RELATION, el frontend usa un autocomplete dropdown que consume:
- **Endpoint**: `GET /api/metadata/entities/{id}/lookup?search={term}`
- Devuelve registros de la entidad destino filtrados por el término de búsqueda
- Se usa `target_display_field` para mostrar el valor legible en el dropdown

---

### Widget Data Service Pattern (Backend)

Match por `widget_type` para generar queries de agregación:

```python
# app/application/services/widget_data_service.py
async def get_widget_data(self, widget: DashboardWidgetModel, entity: EntityModel) -> list | dict:
    match widget.widget_type:
        case "kpi" | "stat":
            return await self._get_aggregate(entity, widget.config)
        case "bar_chart" | "line_chart" | "pie_chart":
            return await self._get_grouped(entity, widget.config)
        case "data_grid":
            return await self._get_paginated(entity, widget.config)
        case "recent_list":
            return await self._get_recent(entity, widget.config)
        case _:
            return []
```

---

## Patrones de Error Handling

### Backend

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class EntityNotFoundException(HTTPException):
    def __init__(self, entity_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entidad con id {entity_id} no encontrada"
        )

class ValidationException(HTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
```

### Frontend

```tsx
// Manejo centralizado de errores
try {
  await entityService.create(data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail || 'Error desconocido';
    setError(message);
  }
}
```

---

## Patrones de Testing

### Backend - Unit Test (patrón real - async con mocks)

```python
# tests/test_crud_service_unit.py
import uuid
from unittest.mock import AsyncMock, MagicMock
import pytest
from app.application.services.crud_service import DynamicCrudService
from app.application.dto.crud_dto import RecordCreate

class TestCreateRecord:
    @pytest.mark.asyncio
    async def test_create_record_success(self):
        field = MagicMock(spec=EntityFieldModel)
        field.name = "nombre"
        field.column_name = "nombre"
        field.field_type = "TEXT"
        field.is_required = False

        entity = MagicMock(spec=EntityModel)
        entity.id = uuid.uuid4()
        entity.table_name = f"entity_{entity.id.hex}"
        entity.fields = [field]

        meta_repo = AsyncMock()
        meta_repo.get_entity_by_id.return_value = entity
        data_repo = AsyncMock()
        data_repo.insert_record.return_value = {"id": uuid.uuid4(), "created_at": "..."}
        data_repo.get_record.return_value = {"id": ..., "created_at": "...", "nombre": "Juan"}

        service = DynamicCrudService(meta_repo, data_repo)
        result = await service.create_record(entity.id, RecordCreate(data={"nombre": "Juan"}))
        assert result.data["nombre"] == "Juan"
```

### Backend - Integration Test (patrón real - httpx AsyncClient)

```python
# tests/test_crud.py
@pytest.fixture
async def entity_with_fields(client: AsyncClient, admin_headers: dict) -> dict:
    resp = await client.post("/api/metadata/entities", json={...}, headers=admin_headers)
    entity_id = resp.json()["id"]
    await client.post(f"/api/metadata/entities/{entity_id}/fields", json={...}, headers=admin_headers)
    return resp.json()

class TestCreateRecord:
    @pytest.mark.asyncio
    async def test_create_record_success(self, client, admin_headers, entity_with_fields):
        entity_id = entity_with_fields["id"]
        resp = await client.post(f"/api/entities/{entity_id}/records", json={"data": {...}}, headers=admin_headers)
        assert resp.status_code == 201
```

---

## Estructura de Commits

```
<tipo>(<alcance>): <descripción corta>

[cuerpo opcional]

[footer opcional]
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambios de código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento

**Ejemplos**:
```
feat(auth): implementar login con JWT
fix(crud): corregir validación de campos requeridos
docs(memory-bank): actualizar progreso de tickets
```

---

> **Actualizar este archivo cuando**: Se establezcan nuevos patrones de código, se cambien convenciones, o se identifiquen mejores prácticas durante el desarrollo.
