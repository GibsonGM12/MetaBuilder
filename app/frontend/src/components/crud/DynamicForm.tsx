import { useState, type FormEvent } from "react";
import type { DynamicRecord, EntityField, FieldType } from "../../types";
import { Button } from "../common/Button";

interface DynamicFormProps {
  fields: EntityField[];
  initialData?: DynamicRecord;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function getInputType(fieldType: FieldType): string {
  switch (fieldType) {
    case "TEXT":
      return "text";
    case "NUMBER":
      return "number";
    case "INTEGER":
      return "number";
    case "DATE":
      return "date";
    case "BOOLEAN":
      return "checkbox";
    default:
      return "text";
  }
}

function parseValue(value: string, fieldType: FieldType): unknown {
  if (value === "") return undefined;
  switch (fieldType) {
    case "NUMBER":
      return parseFloat(value);
    case "INTEGER":
      return parseInt(value, 10);
    case "BOOLEAN":
      return value === "true";
    default:
      return value;
  }
}

export function DynamicForm({
  fields,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: DynamicFormProps) {
  const sortedFields = [...fields].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of sortedFields) {
      const val = initialData?.data?.[field.name];
      if (val !== undefined && val !== null) {
        initial[field.name] = String(val);
      } else {
        initial[field.name] = field.field_type === "BOOLEAN" ? "false" : "";
      }
    }
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of sortedFields) {
      const value = formData[field.name];
      if (
        field.is_required &&
        (value === "" || value === undefined) &&
        field.field_type !== "BOOLEAN"
      ) {
        newErrors[field.name] = `${field.display_name} es requerido`;
      }
      if (
        field.field_type === "TEXT" &&
        field.max_length &&
        value &&
        value.length > field.max_length
      ) {
        newErrors[field.name] =
          `Máximo ${field.max_length} caracteres`;
      }
      if (
        field.field_type === "NUMBER" &&
        value !== "" &&
        isNaN(parseFloat(value))
      ) {
        newErrors[field.name] = "Debe ser un número válido";
      }
      if (
        field.field_type === "INTEGER" &&
        value !== "" &&
        (!Number.isInteger(parseFloat(value)) || isNaN(parseInt(value, 10)))
      ) {
        newErrors[field.name] = "Debe ser un número entero";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const data: Record<string, unknown> = {};
    for (const field of sortedFields) {
      const raw = formData[field.name];
      if (field.field_type === "BOOLEAN") {
        data[field.name] = raw === "true";
      } else {
        const parsed = parseValue(raw, field.field_type);
        if (parsed !== undefined) {
          data[field.name] = parsed;
        }
      }
    }
    onSubmit(data);
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {sortedFields.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={`field-${field.name}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.display_name}
            {field.is_required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>

          {field.field_type === "BOOLEAN" ? (
            <label className="inline-flex items-center cursor-pointer">
              <input
                id={`field-${field.name}`}
                type="checkbox"
                checked={formData[field.name] === "true"}
                onChange={(e) =>
                  handleChange(field.name, e.target.checked ? "true" : "false")
                }
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span className="ml-2 text-sm text-gray-600">
                {formData[field.name] === "true" ? "Sí" : "No"}
              </span>
            </label>
          ) : (
            <input
              id={`field-${field.name}`}
              type={getInputType(field.field_type)}
              value={formData[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              step={field.field_type === "NUMBER" ? "any" : undefined}
              maxLength={
                field.field_type === "TEXT" && field.max_length
                  ? field.max_length
                  : undefined
              }
              className={`block w-full rounded-md shadow-sm sm:text-sm border px-3 py-2 ${
                errors[field.name]
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              }`}
            />
          )}

          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Guardar cambios" : "Crear registro"}
        </Button>
      </div>
    </form>
  );
}
