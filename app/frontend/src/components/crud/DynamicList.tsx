import type { DynamicRecord, EntityField } from "../../types";
import { Button } from "../common/Button";

interface DynamicListProps {
  fields: EntityField[];
  records: DynamicRecord[];
  onEdit: (record: DynamicRecord) => void;
  onDelete: (record: DynamicRecord) => void;
}

function formatValue(value: unknown, fieldType: string): string {
  if (value === null || value === undefined) return "—";
  if (fieldType === "BOOLEAN") return value ? "Sí" : "No";
  if (fieldType === "NUMBER" && typeof value === "number")
    return value.toLocaleString("es-MX", { maximumFractionDigits: 6 });
  return String(value);
}

export function DynamicList({
  fields,
  records,
  onEdit,
  onDelete,
}: DynamicListProps) {
  const sortedFields = [...fields].sort(
    (a, b) => a.display_order - b.display_order,
  );

  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-500">
          No hay registros. Crea el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {sortedFields.map((field) => (
              <th
                key={field.id}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.display_name}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
              {sortedFields.map((field) => (
                <td
                  key={field.id}
                  className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                >
                  {formatValue(record.data[field.name], field.field_type)}
                </td>
              ))}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(record)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(record)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
