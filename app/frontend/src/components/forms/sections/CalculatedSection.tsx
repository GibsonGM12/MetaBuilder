interface CalculatedSectionProps {
  label: string;
  value: number | string;
  format?: "number" | "currency" | "percentage";
}

function formatValue(value: number | string, format?: string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  switch (format) {
    case "currency":
      return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case "percentage":
      return `${num.toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`;
    default:
      return num.toLocaleString("es-MX");
  }
}

export function CalculatedSection({ label, value, format }: CalculatedSectionProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-lg font-semibold text-gray-900">
        {formatValue(value, format)}
      </span>
    </div>
  );
}
