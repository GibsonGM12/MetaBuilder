import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Modal } from "../common/Modal";
import { useAddField, useDeleteField } from "../../hooks/useMetadata";
import type { EntityField, FieldType } from "../../types";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "TEXT", label: "Texto" },
  { value: "NUMBER", label: "Número (decimal)" },
  { value: "INTEGER", label: "Entero" },
  { value: "DATE", label: "Fecha" },
  { value: "BOOLEAN", label: "Booleano" },
];

interface FieldManagerProps {
  entityId: string;
  fields: EntityField[];
}

export function FieldManager({ entityId, fields }: FieldManagerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("TEXT");
  const [isRequired, setIsRequired] = useState(false);
  const [maxLength, setMaxLength] = useState("");
  const [error, setError] = useState("");

  const addField = useAddField(entityId);
  const deleteField = useDeleteField(entityId);

  const resetForm = () => {
    setFieldName("");
    setDisplayName("");
    setFieldType("TEXT");
    setIsRequired(false);
    setMaxLength("");
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await addField.mutateAsync({
        name: fieldName.toLowerCase().replace(/\s+/g, "_"),
        display_name: displayName,
        field_type: fieldType,
        is_required: isRequired,
        max_length: maxLength ? parseInt(maxLength) : undefined,
      });
      resetForm();
      setShowAdd(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr.response?.data?.detail || "Error al agregar campo");
    }
  };

  const handleDeleteField = (field: EntityField) => {
    if (window.confirm(`¿Eliminar el campo "${field.display_name}"?`)) {
      deleteField.mutate(field.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Campos ({fields.length})</h3>
        <Button size="sm" onClick={() => setShowAdd(true)}>Agregar Campo</Button>
      </div>

      {fields.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay campos definidos aún.</p>
          <Button size="sm" className="mt-3" onClick={() => setShowAdd(true)}>
            Agregar primer campo
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requerido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Columna</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fields.map((field) => (
                <tr key={field.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-400">{field.display_order}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{field.display_name}</div>
                    <div className="text-sm text-gray-500">{field.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {field.field_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {field.is_required ? (
                      <span className="text-green-600 font-medium">Sí</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{field.column_name}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="danger" onClick={() => handleDeleteField(field)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); resetForm(); }} title="Agregar Campo">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <Input
            label="Nombre para mostrar"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (!fieldName) setFieldName(e.target.value.toLowerCase().replace(/\s+/g, "_"));
            }}
            required
          />
          <Input
            label="Nombre técnico"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de campo</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as FieldType)}
            >
              {FIELD_TYPES.map((ft) => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
          </div>
          {fieldType === "TEXT" && (
            <Input
              label="Longitud máxima"
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              placeholder="255"
            />
          )}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_required"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_required" className="ml-2 text-sm text-gray-700">
              Campo requerido
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => { setShowAdd(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={addField.isPending}>
              Agregar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
