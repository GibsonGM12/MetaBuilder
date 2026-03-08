import type { EntityField } from "../../../types";

interface FieldsSectionProps {
  fields: EntityField[];
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  readonly?: boolean;
}

function renderInput(
  field: EntityField,
  value: unknown,
  onFieldChange: (name: string, val: unknown) => void,
  readonly: boolean,
) {
  const base =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500";

  switch (field.field_type) {
    case "BOOLEAN":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onFieldChange(field.name, e.target.checked)}
          disabled={readonly}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      );
    case "NUMBER":
      return (
        <input
          type="number"
          step="any"
          value={value != null ? String(value) : ""}
          onChange={(e) => onFieldChange(field.name, e.target.value === "" ? null : Number(e.target.value))}
          disabled={readonly}
          className={base}
        />
      );
    case "INTEGER":
      return (
        <input
          type="number"
          step="1"
          value={value != null ? String(value) : ""}
          onChange={(e) => onFieldChange(field.name, e.target.value === "" ? null : Number(e.target.value))}
          disabled={readonly}
          className={base}
        />
      );
    case "DATE":
      return (
        <input
          type="date"
          value={value != null ? String(value) : ""}
          onChange={(e) => onFieldChange(field.name, e.target.value || null)}
          disabled={readonly}
          className={base}
        />
      );
    default:
      return (
        <input
          type="text"
          value={value != null ? String(value) : ""}
          onChange={(e) => onFieldChange(field.name, e.target.value)}
          disabled={readonly}
          maxLength={field.max_length ?? undefined}
          className={base}
        />
      );
  }
}

export function FieldsSection({ fields, data, onChange, readonly = false }: FieldsSectionProps) {
  const handleFieldChange = (name: string, value: unknown) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <label
          key={field.id}
          className={`block text-sm ${field.field_type === "BOOLEAN" ? "flex items-center gap-2" : ""}`}
        >
          {field.field_type === "BOOLEAN" ? (
            <>
              {renderInput(field, data[field.name], handleFieldChange, readonly)}
              <span className="font-medium text-gray-700">{field.display_name}</span>
            </>
          ) : (
            <>
              <span className="mb-1 block font-medium text-gray-700">
                {field.display_name}
                {field.is_required && <span className="ml-1 text-red-500">*</span>}
              </span>
              {renderInput(field, data[field.name], handleFieldChange, readonly)}
            </>
          )}
        </label>
      ))}
    </div>
  );
}
