interface DataGridWidgetProps {
  data: {
    columns: Array<{ name: string; display_name: string; field_type: string }>;
    items: Array<Record<string, unknown>>;
    total: number;
    page_size: number;
  };
  config: Record<string, unknown>;
  title: string;
}

export function DataGridWidget({ data, title }: DataGridWidgetProps) {
  const { columns, items, total, page_size } = data;
  const totalPages = Math.ceil(total / page_size) || 1;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="whitespace-nowrap bg-gray-50 px-3 py-2 font-medium text-gray-700"
                >
                  {col.display_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((row, idx) => (
              <tr key={idx} className="bg-white hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.name} className="whitespace-nowrap px-3 py-2 text-gray-600">
                    {String(row[col.name] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Mostrando {items.length} de {total} · Página 1 de {totalPages}
      </p>
    </div>
  );
}
