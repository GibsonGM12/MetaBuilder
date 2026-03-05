interface RecentListWidgetProps {
  data: { items: Array<Record<string, unknown>> };
  config: Record<string, unknown>;
  title: string;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  } catch {
    return "-";
  }
}

export function RecentListWidget({ data, title }: RecentListWidgetProps) {
  const items = data.items ?? [];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="divide-y divide-gray-200">
        {items.map((item, idx) => {
          const { created_at, ...fields } = item;
          const fieldEntries = Object.entries(fields).filter(
            ([k]) => k !== "id" && !k.startsWith("_")
          );

          return (
            <div key={idx} className="py-3 first:pt-0 last:pb-0">
              <div className="space-y-1">
                {fieldEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2 text-sm">
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span className="text-gray-900">{String(value ?? "-")}</span>
                  </div>
                ))}
              </div>
              {created_at != null ? (
                <p className="mt-1 text-xs text-gray-400">
                  {formatRelativeTime(String(created_at))}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
