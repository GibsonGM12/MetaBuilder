# Ejemplos de Código

Este documento contiene ejemplos de código para las diferentes partes del sistema.

## Backend - Python (FastAPI + SQLAlchemy)

### 1. DynamicQueryBuilder - Construcción de Queries con SQLAlchemy Core

```python
from uuid import UUID
from typing import Any, Optional

from sqlalchemy import Table, MetaData, select, insert, update, delete, func, asc, desc
from sqlalchemy.engine import Engine


class DynamicQueryBuilder:
    """Construye queries dinámicas usando SQLAlchemy Core sobre tablas entity_{uuid}."""

    def __init__(self, engine: Engine):
        self._engine = engine
        self._metadata = MetaData()

    def _get_table(self, entity_id: UUID) -> Table:
        table_name = f"entity_{entity_id}"
        return Table(table_name, self._metadata, autoload_with=self._engine)

    def build_insert(
        self,
        entity_id: UUID,
        data: dict[str, Any],
    ) -> tuple:
        table = self._get_table(entity_id)
        stmt = insert(table).values(**data).returning(table.c.id)
        return stmt

    def build_select(
        self,
        entity_id: UUID,
        record_id: Optional[UUID] = None,
        filters: Optional[dict[str, Any]] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = "asc",
        page: Optional[int] = None,
        page_size: Optional[int] = None,
    ):
        table = self._get_table(entity_id)
        stmt = select(table)

        if record_id is not None:
            stmt = stmt.where(table.c.id == record_id)

        if filters:
            for col_name, value in filters.items():
                if hasattr(table.c, col_name):
                    stmt = stmt.where(table.c[col_name] == value)

        if sort_by and hasattr(table.c, sort_by):
            order_fn = desc if sort_direction.lower() == "desc" else asc
            stmt = stmt.order_by(order_fn(table.c[sort_by]))

        if page is not None and page_size is not None:
            offset = (page - 1) * page_size
            stmt = stmt.limit(page_size).offset(offset)

        return stmt

    def build_count(
        self,
        entity_id: UUID,
        filters: Optional[dict[str, Any]] = None,
    ):
        table = self._get_table(entity_id)
        stmt = select(func.count()).select_from(table)

        if filters:
            for col_name, value in filters.items():
                if hasattr(table.c, col_name):
                    stmt = stmt.where(table.c[col_name] == value)

        return stmt

    def build_update(
        self,
        entity_id: UUID,
        record_id: UUID,
        data: dict[str, Any],
    ):
        table = self._get_table(entity_id)
        stmt = (
            update(table)
            .where(table.c.id == record_id)
            .values(**data, updated_at=func.now())
        )
        return stmt

    def build_delete(self, entity_id: UUID, record_id: UUID):
        table = self._get_table(entity_id)
        stmt = delete(table).where(table.c.id == record_id)
        return stmt
```

### 2. DynamicCrudService - Servicio de CRUD Genérico

```python
import math
from uuid import UUID
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.metadata import Entity, EntityField
from app.infrastructure.repositories.metadata_repository import MetadataRepository
from app.services.query_builder import DynamicQueryBuilder


class RecordNotFoundError(Exception):
    pass


class EntityNotFoundError(Exception):
    pass


class ValidationError(Exception):
    def __init__(self, errors: dict[str, str]):
        self.errors = errors
        super().__init__(str(errors))


class PagedResult:
    def __init__(
        self,
        data: list[dict[str, Any]],
        page: int,
        page_size: int,
        total_records: int,
    ):
        self.data = data
        self.page = page
        self.page_size = page_size
        self.total_records = total_records
        self.total_pages = math.ceil(total_records / page_size) if page_size > 0 else 0


class DynamicCrudService:
    def __init__(
        self,
        session: AsyncSession,
        metadata_repo: MetadataRepository,
        query_builder: DynamicQueryBuilder,
    ):
        self._session = session
        self._metadata_repo = metadata_repo
        self._qb = query_builder

    async def _get_entity_or_raise(self, entity_id: UUID) -> Entity:
        entity = await self._metadata_repo.get_entity_by_id(entity_id)
        if entity is None:
            raise EntityNotFoundError(f"Entity {entity_id} not found")
        return entity

    def _validate_data(
        self,
        fields: list[EntityField],
        data: dict[str, Any],
        is_update: bool = False,
    ) -> None:
        errors: dict[str, str] = {}
        field_map = {f.name: f for f in fields}

        if not is_update:
            for field in fields:
                if field.is_required and field.name not in data:
                    errors[field.name] = f"{field.display_name} es requerido"

        for key, value in data.items():
            field = field_map.get(key)
            if field is None:
                errors[key] = f"Campo '{key}' no existe en la entidad"
                continue
            if field.max_length and isinstance(value, str) and len(value) > field.max_length:
                errors[key] = f"Máximo {field.max_length} caracteres"

        if errors:
            raise ValidationError(errors)

    async def create_record(
        self,
        entity_id: UUID,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        entity = await self._get_entity_or_raise(entity_id)
        self._validate_data(entity.fields, data)

        stmt = self._qb.build_insert(entity_id, data)
        result = await self._session.execute(stmt)
        await self._session.commit()

        record_id = result.scalar_one()
        return await self.get_record_by_id(entity_id, record_id)

    async def get_record_by_id(
        self,
        entity_id: UUID,
        record_id: UUID,
    ) -> dict[str, Any]:
        await self._get_entity_or_raise(entity_id)

        stmt = self._qb.build_select(entity_id, record_id=record_id)
        result = await self._session.execute(stmt)
        row = result.mappings().first()

        if row is None:
            raise RecordNotFoundError(f"Record {record_id} not found")

        return dict(row)

    async def get_records(
        self,
        entity_id: UUID,
        filters: Optional[dict[str, Any]] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = "asc",
        page: int = 1,
        page_size: int = 20,
    ) -> PagedResult:
        await self._get_entity_or_raise(entity_id)

        stmt = self._qb.build_select(
            entity_id,
            filters=filters,
            sort_by=sort_by,
            sort_direction=sort_direction,
            page=page,
            page_size=page_size,
        )
        result = await self._session.execute(stmt)
        records = [dict(row) for row in result.mappings().all()]

        count_stmt = self._qb.build_count(entity_id, filters=filters)
        total = (await self._session.execute(count_stmt)).scalar_one()

        return PagedResult(
            data=records,
            page=page,
            page_size=page_size,
            total_records=total,
        )

    async def update_record(
        self,
        entity_id: UUID,
        record_id: UUID,
        data: dict[str, Any],
    ) -> dict[str, Any]:
        entity = await self._get_entity_or_raise(entity_id)
        await self.get_record_by_id(entity_id, record_id)

        self._validate_data(entity.fields, data, is_update=True)

        stmt = self._qb.build_update(entity_id, record_id, data)
        await self._session.execute(stmt)
        await self._session.commit()

        return await self.get_record_by_id(entity_id, record_id)

    async def delete_record(
        self,
        entity_id: UUID,
        record_id: UUID,
    ) -> None:
        await self._get_entity_or_raise(entity_id)
        await self.get_record_by_id(entity_id, record_id)

        stmt = self._qb.build_delete(entity_id, record_id)
        await self._session.execute(stmt)
        await self._session.commit()
```

### 3. MetadataService - Gestión de Metadatos

```python
from uuid import UUID, uuid4
from typing import Optional

from sqlalchemy import text, Column, String, Integer, Float, Boolean, Date, Text
from sqlalchemy import Table as SaTable, MetaData as SaMetadata
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine

from app.domain.entities.metadata import Entity, EntityField
from app.infrastructure.repositories.metadata_repository import MetadataRepository


FIELD_TYPE_MAP = {
    "TEXT": String(255),
    "NUMBER": Float,
    "INTEGER": Integer,
    "DATE": Date,
    "BOOLEAN": Boolean,
}


class MetadataService:
    def __init__(
        self,
        session: AsyncSession,
        engine: AsyncEngine,
        metadata_repo: MetadataRepository,
    ):
        self._session = session
        self._engine = engine
        self._metadata_repo = metadata_repo

    async def create_entity(
        self,
        name: str,
        display_name: str,
        description: Optional[str] = None,
    ) -> Entity:
        existing = await self._metadata_repo.get_entity_by_name(name)
        if existing is not None:
            raise ValueError(f"Entity with name '{name}' already exists")

        entity_id = uuid4()
        table_name = f"entity_{entity_id}"

        entity = await self._metadata_repo.create_entity(
            id=entity_id,
            name=name,
            display_name=display_name,
            description=description,
            table_name=table_name,
        )

        await self._create_physical_table(table_name)
        return entity

    async def _create_physical_table(self, table_name: str) -> None:
        ddl = text(f"""
            CREATE TABLE {table_name} (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        """)
        async with self._engine.begin() as conn:
            await conn.execute(ddl)

    async def add_field_to_entity(
        self,
        entity_id: UUID,
        name: str,
        display_name: str,
        field_type: str,
        is_required: bool = False,
        max_length: Optional[int] = None,
    ) -> EntityField:
        entity = await self._metadata_repo.get_entity_by_id(entity_id)
        if entity is None:
            raise ValueError(f"Entity {entity_id} not found")

        existing_field = next((f for f in entity.fields if f.name == name), None)
        if existing_field is not None:
            raise ValueError(f"Field '{name}' already exists in entity")

        field = await self._metadata_repo.add_field(
            entity_id=entity_id,
            name=name,
            display_name=display_name,
            field_type=field_type,
            is_required=is_required,
            max_length=max_length,
        )

        await self._add_physical_column(
            table_name=entity.table_name,
            column_name=name,
            field_type=field_type,
            is_required=is_required,
            max_length=max_length,
        )

        return field

    async def _add_physical_column(
        self,
        table_name: str,
        column_name: str,
        field_type: str,
        is_required: bool,
        max_length: Optional[int],
    ) -> None:
        pg_type = self._resolve_pg_type(field_type, max_length)
        nullable = "" if not is_required else " NOT NULL"

        ddl = text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {pg_type}{nullable}")
        async with self._engine.begin() as conn:
            await conn.execute(ddl)

    @staticmethod
    def _resolve_pg_type(field_type: str, max_length: Optional[int] = None) -> str:
        mapping = {
            "TEXT": f"VARCHAR({max_length})" if max_length else "TEXT",
            "NUMBER": "DOUBLE PRECISION",
            "INTEGER": "INTEGER",
            "DATE": "DATE",
            "BOOLEAN": "BOOLEAN",
        }
        return mapping.get(field_type, "TEXT")

    async def delete_entity(self, entity_id: UUID) -> None:
        entity = await self._metadata_repo.get_entity_by_id(entity_id)
        if entity is None:
            raise ValueError(f"Entity {entity_id} not found")

        ddl = text(f"DROP TABLE IF EXISTS {entity.table_name}")
        async with self._engine.begin() as conn:
            await conn.execute(ddl)

        await self._metadata_repo.delete_entity(entity_id)
```

## Frontend - React + TypeScript

### 4. Hook useMetadata - Carga de Metadatos

```typescript
import { useState, useEffect } from 'react';
import { metadataApi } from '../services/api/metadataApi';
import { EntityDefinition } from '../types/metadata';

export const useMetadata = (entityId: string | null) => {
  const [metadata, setMetadata] = useState<EntityDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) {
      setMetadata(null);
      return;
    }

    const loadMetadata = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await metadataApi.getEntity(entityId);
        setMetadata(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading metadata');
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [entityId]);

  return { metadata, loading, error };
};
```

### 5. Componente DynamicForm - Formulario Dinámico

```typescript
import React, { useState, useEffect } from 'react';
import { useMetadata } from '../hooks/useMetadata';
import { DynamicField } from './DynamicField';
import { FormValidator } from '../utils/FormValidator';

interface DynamicFormProps {
  entityId: string;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  entityId,
  initialData = {},
  onSubmit,
  onCancel
}) => {
  const { metadata, loading } = useMetadata(entityId);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (metadata) {
      const field = metadata.fields.find(f => f.name === fieldName);
      if (field) {
        const error = FormValidator.validateField(field, value);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error || ''
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!metadata) return;

    const validationErrors = FormValidator.validateForm(metadata, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!metadata) {
    return <div className="text-red-500">Error: No se pudo cargar la configuración</div>;
  }

  const sortedFields = [...metadata.fields].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {sortedFields.map(field => (
        <DynamicField
          key={field.id}
          field={field}
          value={formData[field.name] ?? field.defaultValue ?? ''}
          onChange={(value) => handleFieldChange(field.name, value)}
          error={errors[field.name]}
        />
      ))}

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
```

### 6. Componente DynamicField - Campo Dinámico Individual

```typescript
import React from 'react';
import { EntityField } from '../types/metadata';

interface DynamicFieldProps {
  field: EntityField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const renderInput = () => {
    switch (field.fieldType) {
      case 'TEXT':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            required={field.isRequired}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'NUMBER':
      case 'INTEGER':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(
              field.fieldType === 'INTEGER'
                ? parseInt(e.target.value, 10) || 0
                : parseFloat(e.target.value) || 0
            )}
            required={field.isRequired}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.isRequired}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'BOOLEAN':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {field.displayName}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {field.description && (
        <p className="text-sm text-gray-500">{field.description}</p>
      )}
    </div>
  );
};
```

### 7. Servicio API - Cliente HTTP con JWT

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:8000/api');
```

### 8. Validador de Formularios

```typescript
import { EntityDefinition, EntityField } from '../types/metadata';

export class FormValidator {
  static validateForm(
    entity: EntityDefinition,
    data: Record<string, any>
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    entity.fields.forEach(field => {
      const error = this.validateField(field, data[field.name]);
      if (error) {
        errors[field.name] = error;
      }
    });

    return errors;
  }

  static validateField(field: EntityField, value: any): string | null {
    if (field.isRequired && (value === null || value === undefined || value === '')) {
      return `${field.displayName} es requerido`;
    }

    if (!field.isRequired && (value === null || value === undefined || value === '')) {
      return null;
    }

    switch (field.fieldType) {
      case 'NUMBER':
      case 'INTEGER':
        if (isNaN(value)) {
          return 'Debe ser un número válido';
        }
        break;

      case 'TEXT':
        if (field.maxLength && value.length > field.maxLength) {
          return `Máximo ${field.maxLength} caracteres`;
        }
        break;
    }

    return null;
  }
}
```

Estos ejemplos proporcionan una base sólida para implementar el sistema. Ajusta según las necesidades específicas del proyecto.
