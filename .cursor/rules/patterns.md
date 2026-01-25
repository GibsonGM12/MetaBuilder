# 📐 MetaBuilder - Patrones y Convenciones

> **Última actualización**: 24 de Enero 2026

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

### Backend - Estructura de Router

```python
# app/api/routers/entities.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.services.metadata_service import MetadataService
from app.api.deps import get_current_user, get_metadata_service
from app.schemas.entity import EntityCreate, EntityResponse

router = APIRouter(prefix="/entities", tags=["entities"])

@router.post("/", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
async def create_entity(
    entity_data: EntityCreate,
    service: MetadataService = Depends(get_metadata_service),
    current_user = Depends(get_current_user)
):
    """Crear una nueva entidad."""
    return await service.create_entity(entity_data)
```

### Backend - Estructura de Service

```python
# app/services/metadata_service.py
from app.infrastructure.repositories.metadata_repository import MetadataRepository
from app.infrastructure.table_manager import TableManager
from app.schemas.entity import EntityCreate, EntityResponse

class MetadataService:
    def __init__(self, repository: MetadataRepository, table_manager: TableManager):
        self._repository = repository
        self._table_manager = table_manager
    
    async def create_entity(self, data: EntityCreate) -> EntityResponse:
        # 1. Validar
        # 2. Crear en repositorio
        # 3. Crear tabla dinámica
        # 4. Retornar respuesta
        pass
```

### Backend - Estructura de Repository

```python
# app/infrastructure/repositories/metadata_repository.py
from sqlalchemy.orm import Session
from app.infrastructure.models import EntityModel
from typing import Optional, List
from uuid import UUID

class MetadataRepository:
    def __init__(self, session: Session):
        self._session = session
    
    def create(self, entity: EntityModel) -> EntityModel:
        self._session.add(entity)
        self._session.commit()
        self._session.refresh(entity)
        return entity
    
    def get_by_id(self, id: UUID) -> Optional[EntityModel]:
        return self._session.query(EntityModel).filter(EntityModel.id == id).first()
    
    def get_all(self) -> List[EntityModel]:
        return self._session.query(EntityModel).all()
```

### Backend - Estructura de DTO/Schema

```python
# app/schemas/entity.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class EntityBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    display_name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None

class EntityCreate(EntityBase):
    pass

class EntityUpdate(BaseModel):
    display_name: Optional[str] = None
    description: Optional[str] = None

class EntityResponse(EntityBase):
    id: UUID
    table_name: str
    created_at: datetime
    
    class Config:
        from_attributes = True
```

---

### Frontend - Estructura de Componente

```tsx
// src/components/entities/EntityList.tsx
import { useState, useEffect } from 'react';
import { Entity } from '../../types/entity';
import { entityService } from '../../services/entityService';

interface EntityListProps {
  onSelect?: (entity: Entity) => void;
}

export const EntityList = ({ onSelect }: EntityListProps) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      setLoading(true);
      const data = await entityService.getAll();
      setEntities(data);
    } catch (err) {
      setError('Error al cargar entidades');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {entities.map((entity) => (
        <div
          key={entity.id}
          onClick={() => onSelect?.(entity)}
          className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <h3 className="font-medium">{entity.display_name}</h3>
          <p className="text-sm text-gray-500">{entity.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Frontend - Estructura de Service

```tsx
// src/services/entityService.ts
import { api } from './api';
import { Entity, EntityCreate } from '../types/entity';

export const entityService = {
  getAll: async (): Promise<Entity[]> => {
    const response = await api.get('/entities');
    return response.data;
  },

  getById: async (id: string): Promise<Entity> => {
    const response = await api.get(`/entities/${id}`);
    return response.data;
  },

  create: async (data: EntityCreate): Promise<Entity> => {
    const response = await api.post('/entities', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Entity>): Promise<Entity> => {
    const response = await api.put(`/entities/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/entities/${id}`);
  },
};
```

### Frontend - Estructura de Hook Personalizado

```tsx
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
};
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

### Backend - Unit Test

```python
# tests/test_metadata_service.py
import pytest
from unittest.mock import Mock
from app.services.metadata_service import MetadataService

def test_create_entity_success():
    mock_repo = Mock()
    mock_table_manager = Mock()
    service = MetadataService(mock_repo, mock_table_manager)
    
    # Arrange
    entity_data = EntityCreate(name="productos", display_name="Productos")
    
    # Act
    result = service.create_entity(entity_data)
    
    # Assert
    mock_repo.create.assert_called_once()
    mock_table_manager.create_table.assert_called_once()
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
