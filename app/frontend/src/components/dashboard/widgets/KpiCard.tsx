const COLOR_BORDERS: Record<string, string> = {
  blue: "border-l-blue-500",
  green: "border-l-green-500",
  red: "border-l-red-500",
  yellow: "border-l-yellow-500",
  purple: "border-l-purple-500",
  indigo: "border-l-indigo-500",
};

interface KpiCardProps {
  data: { value: number; format?: string; label?: string };
  config: Record<string, unknown>;
  title: string;
}

function formatValue(value: number, format?: string): string {
  if (format === "currency") {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (format === "percentage") {
    return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }
  return value.toLocaleString();
}

export function KpiCard({ data, config, title }: KpiCardProps) {
  const colorKey = ((config.color as string) ?? "blue").toLowerCase();
  const borderClass = COLOR_BORDERS[colorKey] ?? COLOR_BORDERS.blue;

  return (
    <div className={`rounded-lg border-l-4 bg-white p-4 ${borderClass}`}>
      <p className="text-2xl font-bold text-gray-900">
        {formatValue(data.value, data.format)}
      </p>
      <p className="mt-1 text-sm text-gray-600">{data.label ?? title}</p>
    </div>
  );
}
