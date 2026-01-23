# Ejemplos de Código

Este documento contiene ejemplos de código para las diferentes partes del sistema.

## Backend - C#

### 1. DynamicQueryBuilder - Construcción de Queries SQL Dinámicas

```csharp
using System.Text;
using System.Collections.Generic;

namespace LowCodePlatform.Domain.QueryBuilders
{
    public class DynamicQueryBuilder
    {
        public class QueryResult
        {
            public string Sql { get; set; }
            public Dictionary<string, object> Parameters { get; set; }
        }

        public QueryResult BuildInsertQuery(EntityDefinition entity, Dictionary<string, object> data)
        {
            var sql = new StringBuilder();
            var parameters = new Dictionary<string, object>();
            var columns = new List<string>();
            var values = new List<string>();

            sql.Append($"INSERT INTO {entity.TableName} (");

            foreach (var field in entity.Fields.Where(f => !f.IsComputed))
            {
                if (data.ContainsKey(field.Name) || field.DefaultValue != null)
                {
                    columns.Add(field.ColumnName);
                    var paramName = $"@{field.Name}";
                    values.Add(paramName);
                    
                    if (data.ContainsKey(field.Name))
                    {
                        parameters[field.Name] = data[field.Name];
                    }
                    else if (field.DefaultValue != null)
                    {
                        parameters[field.Name] = field.DefaultValue;
                    }
                }
            }

            sql.Append(string.Join(", ", columns));
            sql.Append(") VALUES (");
            sql.Append(string.Join(", ", values));
            sql.Append(") RETURNING id;");

            return new QueryResult
            {
                Sql = sql.ToString(),
                Parameters = parameters
            };
        }

        public QueryResult BuildSelectQuery(
            EntityDefinition entity,
            string recordId = null,
            Dictionary<string, object> filters = null,
            string sortBy = null,
            string sortDirection = "ASC",
            int? page = null,
            int? pageSize = null)
        {
            var sql = new StringBuilder();
            var parameters = new Dictionary<string, object>();

            sql.Append("SELECT ed.id, ed.created_at, ed.updated_at, ed.version, ");

            var fieldColumns = entity.Fields
                .Select(f => $"{entity.TableName}.{f.ColumnName}")
                .ToList();

            sql.Append(string.Join(", ", fieldColumns));
            sql.Append($" FROM {entity.TableName} ");
            sql.Append("INNER JOIN entity_data ed ON ed.id = ").Append($"{entity.TableName}.id ");
            sql.Append("WHERE ed.entity_id = @entityId AND ed.deleted_at IS NULL ");

            parameters["entityId"] = entity.Id;

            if (!string.IsNullOrEmpty(recordId))
            {
                sql.Append("AND ed.id = @recordId ");
                parameters["recordId"] = recordId;
            }

            if (filters != null && filters.Any())
            {
                foreach (var filter in filters)
                {
                    var field = entity.Fields.FirstOrDefault(f => f.Name == filter.Key);
                    if (field != null)
                    {
                        sql.Append($"AND {entity.TableName}.{field.ColumnName} = @{field.Name} ");
                        parameters[field.Name] = filter.Value;
                    }
                }
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                var sortField = entity.Fields.FirstOrDefault(f => f.Name == sortBy);
                if (sortField != null)
                {
                    sql.Append($"ORDER BY {entity.TableName}.{sortField.ColumnName} {sortDirection} ");
                }
            }

            if (page.HasValue && pageSize.HasValue)
            {
                sql.Append($"LIMIT @pageSize OFFSET @offset ");
                parameters["pageSize"] = pageSize.Value;
                parameters["offset"] = (page.Value - 1) * pageSize.Value;
            }

            return new QueryResult
            {
                Sql = sql.ToString(),
                Parameters = parameters
            };
        }

        public QueryResult BuildUpdateQuery(
            EntityDefinition entity,
            string recordId,
            Dictionary<string, object> data)
        {
            var sql = new StringBuilder();
            var parameters = new Dictionary<string, object>();

            sql.Append($"UPDATE {entity.TableName} SET ");

            var setClauses = new List<string>();
            foreach (var field in entity.Fields.Where(f => !f.IsComputed && data.ContainsKey(f.Name)))
            {
                setClauses.Add($"{field.ColumnName} = @{field.Name}");
                parameters[field.Name] = data[field.Name];
            }

            sql.Append(string.Join(", ", setClauses));
            sql.Append(" WHERE id = @recordId;");

            parameters["recordId"] = recordId;

            return new QueryResult
            {
                Sql = sql.ToString(),
                Parameters = parameters
            };
        }
    }
}
```

### 2. DynamicCrudService - Servicio de CRUD Genérico

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LowCodePlatform.Domain.Entities;
using LowCodePlatform.Domain.QueryBuilders;
using LowCodePlatform.Infrastructure.Data;

namespace LowCodePlatform.Application.Services
{
    public class DynamicCrudService
    {
        private readonly IMetadataRepository _metadataRepository;
        private readonly IDynamicDataRepository _dataRepository;
        private readonly DynamicQueryBuilder _queryBuilder;
        private readonly DataValidator _validator;
        private readonly IAuditService _auditService;

        public DynamicCrudService(
            IMetadataRepository metadataRepository,
            IDynamicDataRepository dataRepository,
            DynamicQueryBuilder queryBuilder,
            DataValidator validator,
            IAuditService auditService)
        {
            _metadataRepository = metadataRepository;
            _dataRepository = dataRepository;
            _queryBuilder = queryBuilder;
            _validator = validator;
            _auditService = auditService;
        }

        public async Task<Dictionary<string, object>> CreateRecordAsync(
            Guid entityId,
            Dictionary<string, object> data,
            Guid userId)
        {
            // Obtener metadatos de la entidad
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            // Validar datos
            await _validator.ValidateAsync(entity, data);

            // Construir query de inserción
            var query = _queryBuilder.BuildInsertQuery(entity, data);

            // Ejecutar inserción
            var recordId = await _dataRepository.ExecuteInsertAsync(query);

            // Registrar en entity_data
            await _dataRepository.CreateEntityDataRecordAsync(entityId, recordId, userId);

            // Crear versión inicial
            await _dataRepository.CreateVersionAsync(recordId, entityId, data, userId);

            // Registrar auditoría
            await _auditService.LogCreateAsync(userId, entityId, recordId, data);

            // Obtener registro completo
            return await GetRecordByIdAsync(entityId, recordId);
        }

        public async Task<Dictionary<string, object>> GetRecordByIdAsync(
            Guid entityId,
            Guid recordId)
        {
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            var query = _queryBuilder.BuildSelectQuery(entity, recordId.ToString());
            var result = await _dataRepository.ExecuteSelectAsync(query);

            return result.FirstOrDefault() ?? throw new RecordNotFoundException($"Record {recordId} not found");
        }

        public async Task<PagedResult<Dictionary<string, object>>> GetRecordsAsync(
            Guid entityId,
            Dictionary<string, object> filters = null,
            string sortBy = null,
            string sortDirection = "ASC",
            int page = 1,
            int pageSize = 20)
        {
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            var query = _queryBuilder.BuildSelectQuery(
                entity,
                filters: filters,
                sortBy: sortBy,
                sortDirection: sortDirection,
                page: page,
                pageSize: pageSize);

            var records = await _dataRepository.ExecuteSelectAsync(query);
            var totalCount = await _dataRepository.GetRecordCountAsync(entityId, filters);

            return new PagedResult<Dictionary<string, object>>
            {
                Data = records,
                Page = page,
                PageSize = pageSize,
                TotalRecords = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<Dictionary<string, object>> UpdateRecordAsync(
            Guid entityId,
            Guid recordId,
            Dictionary<string, object> data,
            Guid userId)
        {
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            // Obtener registro actual para auditoría
            var currentRecord = await GetRecordByIdAsync(entityId, recordId);
            var oldValues = new Dictionary<string, object>(currentRecord);

            // Validar datos
            await _validator.ValidateAsync(entity, data, isUpdate: true);

            // Construir query de actualización
            var query = _queryBuilder.BuildUpdateQuery(entity, recordId.ToString(), data);

            // Ejecutar actualización
            await _dataRepository.ExecuteUpdateAsync(query);

            // Actualizar entity_data
            await _dataRepository.UpdateEntityDataRecordAsync(recordId, userId);

            // Crear nueva versión
            var newRecord = await GetRecordByIdAsync(entityId, recordId);
            await _dataRepository.CreateVersionAsync(recordId, entityId, newRecord, userId);

            // Registrar auditoría
            await _auditService.LogUpdateAsync(userId, entityId, recordId, oldValues, data);

            return newRecord;
        }

        public async Task DeleteRecordAsync(
            Guid entityId,
            Guid recordId,
            Guid userId)
        {
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            // Obtener registro para auditoría
            var record = await GetRecordByIdAsync(entityId, recordId);

            // Soft delete
            await _dataRepository.SoftDeleteRecordAsync(recordId, userId);

            // Registrar auditoría
            await _auditService.LogDeleteAsync(userId, entityId, recordId, record);
        }
    }
}
```

### 3. MetadataService - Gestión de Metadatos

```csharp
using System;
using System.Threading.Tasks;
using LowCodePlatform.Domain.Entities;
using LowCodePlatform.Infrastructure.Data;

namespace LowCodePlatform.Application.Services
{
    public class MetadataService
    {
        private readonly IMetadataRepository _metadataRepository;
        private readonly IDynamicDataRepository _dataRepository;

        public MetadataService(
            IMetadataRepository metadataRepository,
            IDynamicDataRepository dataRepository)
        {
            _metadataRepository = metadataRepository;
            _dataRepository = dataRepository;
        }

        public async Task<EntityDefinition> CreateEntityAsync(
            EntityDefinition entityDefinition,
            Guid userId)
        {
            // Validar nombre único
            var existing = await _metadataRepository.GetEntityByNameAsync(entityDefinition.Name);
            if (existing != null)
                throw new InvalidOperationException($"Entity with name '{entityDefinition.Name}' already exists");

            // Generar nombre de tabla
            entityDefinition.TableName = $"entity_{Guid.NewGuid():N}";

            // Crear entidad en base de datos
            var entity = await _metadataRepository.CreateEntityAsync(entityDefinition, userId);

            // Crear tabla física
            await _dataRepository.CreateEntityTableAsync(entity);

            return entity;
        }

        public async Task<EntityField> AddFieldToEntityAsync(
            Guid entityId,
            EntityField field,
            Guid userId)
        {
            var entity = await _metadataRepository.GetEntityByIdAsync(entityId);
            if (entity == null)
                throw new EntityNotFoundException($"Entity {entityId} not found");

            // Validar nombre único en la entidad
            var existingField = entity.Fields.FirstOrDefault(f => f.Name == field.Name);
            if (existingField != null)
                throw new InvalidOperationException($"Field '{field.Name}' already exists in entity");

            // Generar nombre de columna
            field.ColumnName = field.ColumnName ?? $"col_{field.Name}";

            // Agregar campo a la entidad
            var createdField = await _metadataRepository.AddFieldAsync(entityId, field, userId);

            // Agregar columna a la tabla física
            await _dataRepository.AddColumnToEntityTableAsync(entity, createdField);

            return createdField;
        }

        public async Task<EntityRelation> CreateRelationAsync(
            Guid sourceEntityId,
            Guid targetEntityId,
            EntityRelation relation,
            Guid userId)
        {
            var sourceEntity = await _metadataRepository.GetEntityByIdAsync(sourceEntityId);
            var targetEntity = await _metadataRepository.GetEntityByIdAsync(targetEntityId);

            if (sourceEntity == null || targetEntity == null)
                throw new EntityNotFoundException("Source or target entity not found");

            relation.SourceEntityId = sourceEntityId;
            relation.TargetEntityId = targetEntityId;

            return await _metadataRepository.CreateRelationAsync(relation, userId);
        }
    }
}
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

    // Validar en tiempo real
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

    // Validar todos los campos
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
      case 'EMAIL':
      case 'URL':
        return (
          <input
            type={field.fieldType === 'EMAIL' ? 'email' : field.fieldType === 'URL' ? 'url' : 'text'}
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
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
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

      case 'TEXTAREA':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            required={field.isRequired}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
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

### 7. Servicio API - Cliente HTTP Genérico

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { keycloakService } from './auth/keycloakService';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para agregar token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await keycloakService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado, intentar refrescar
          await keycloakService.refreshToken();
          // Reintentar request
          return this.client.request(error.config);
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

export const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');
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
    // Campo requerido
    if (field.isRequired && (value === null || value === undefined || value === '')) {
      return `${field.displayName} es requerido`;
    }

    // Si el campo está vacío y no es requerido, no validar más
    if (!field.isRequired && (value === null || value === undefined || value === '')) {
      return null;
    }

    // Validación por tipo
    switch (field.fieldType) {
      case 'EMAIL':
        if (!this.isValidEmail(value)) {
          return 'Formato de email inválido';
        }
        break;

      case 'URL':
        if (!this.isValidUrl(value)) {
          return 'Formato de URL inválido';
        }
        break;

      case 'NUMBER':
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

    // Validaciones personalizadas
    if (field.validations) {
      for (const validation of field.validations) {
        const error = this.validateRule(validation, value);
        if (error) {
          return error;
        }
      }
    }

    return null;
  }

  private static validateRule(validation: any, value: any): string | null {
    switch (validation.validationType) {
      case 'REGEX':
        const regex = new RegExp(validation.validationRule);
        if (!regex.test(value)) {
          return validation.errorMessage || 'Valor no válido';
        }
        break;

      case 'MIN':
        if (parseFloat(value) < parseFloat(validation.validationRule)) {
          return validation.errorMessage || `Valor mínimo: ${validation.validationRule}`;
        }
        break;

      case 'MAX':
        if (parseFloat(value) > parseFloat(validation.validationRule)) {
          return validation.errorMessage || `Valor máximo: ${validation.validationRule}`;
        }
        break;
    }

    return null;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
```

Estos ejemplos proporcionan una base sólida para implementar el sistema. Ajusta según las necesidades específicas del proyecto.

