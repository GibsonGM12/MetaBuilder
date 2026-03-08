import { Plus, X } from "lucide-react";
import type { EntityField } from "../../../types";

interface DetailTableSectionProps {
  fields: EntityField[];
  rows: Array<Record<string, unknown>>;
  onChange: (rows: Array<Record<string, unknown>>) => void;
  readonly?: boolean;
}

function cellInput(
  field: EntityField,
  value: unknown,
  onCellChange: (val: unknown) => void,
  disabled: boolean,
) {
  const base =
    "w-full border-0 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:text-gray-500";

  switch (field.field_type) {
    case "BOOLEAN":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onCellChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-primary-600"
        />
      );
    case "NUMBER":
      return (
        <input
          type="number"
          step="any"
          value={value != null ? String(value) : ""}
          onChange={(e) => onCellChange(e.target.value === "" ? null : Number(e.target.value))}
          disabled={disabled}
          className={base}
        />
      );
    case "INTEGER":
      return (
        <input
          type="number"
          step="1"
          value={value != null ? String(value) : ""}
          onChange={(e) => onCellChange(e.target.value === "" ? null : Number(e.target.value))}
          disabled={disabled}
          className={base}
        />
      );
    case "DATE":
      return (
        <input
          type="date"
          value={value != null ? String(value) : ""}
          onChange={(e) => onCellChange(e.target.value || null)}
          disabled={disabled}
          className={base}
        />
      );
    case "RELATION":
      return (
        <input
          type="text"
          value={value != null ? String(value) : ""}
          onChange={(e) => onCellChange(e.target.value)}
          disabled={disabled}
          placeholder="UUID"
          className={base}
        />
      );
    default:
      return (
        <input
          type="text"
          value={value != null ? String(value) : ""}
          onChange={(e) => onCellChange(e.target.value)}
          disabled={disabled}
          className={base}
        />
      );
  }
}

export function DetailTableSection({
  fields,
  rows,
  onChange,
  readonly = false,
}: DetailTableSectionProps) {
  const handleCellChange = (rowIndex: number, fieldName: string, value: unknown) => {
    const updated = rows.map((row, i) =>
      i === rowIndex ? { ...row, [fieldName]: value } : row,
    );
    onChange(updated);
  };

  const handleAddRow = () => {
    const emptyRow: Record<string, unknown> = {};
    for (const f of fields) {
      emptyRow[f.name] = f.field_type === "BOOLEAN" ? false : null;
    }
    onChange([...rows, emptyRow]);
  };

  const handleDeleteRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-md border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {fields.map((f) => (
              <th
                key={f.id}
                className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {f.display_name}
              </th>
            ))}
            {!readonly && <th className="w-10 px-2 py-2" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {fields.map((f) => (
                <td key={f.id} className="px-1 py-1">
                  {cellInput(f, row[f.name], (val) => handleCellChange(rowIdx, f.name, val), readonly)}
                </td>
              ))}
              {!readonly && (
                <td className="px-1 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(rowIdx)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={fields.length + (readonly ? 0 : 1)}
                className="px-3 py-4 text-center text-sm text-gray-400"
              >
                Sin líneas de detalle
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!readonly && (
        <button
          type="button"
          onClick={handleAddRow}
          className="mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600"
        >
          <Plus className="h-4 w-4" />
          Agregar línea
        </button>
      )}
    </div>
  );
}
