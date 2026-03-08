import { Link } from "react-router-dom";
import { useDashboards } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "hace un momento";
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHour < 24) return `hace ${diffHour} h`;
  if (diffDay < 7) return `hace ${diffDay} días`;
  return date.toLocaleDateString();
}

export function DashboardList() {
  const { data: dashboards, isLoading } = useDashboards();
  const { isAdmin } = useAuth();

  if (isLoading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboards</h1>
        {isAdmin && (
          <Link
            to="/admin/dashboards/new"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Crear Dashboard
          </Link>
        )}
      </div>

      {!dashboards?.length ? (
        <p className="text-gray-500">No hay dashboards disponibles</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboards.map((d) => (
            <Link
              key={d.id}
              to={`/dashboards/${d.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-gray-900">{d.name}</h2>
                {d.is_default && (
                  <span className="shrink-0 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    Por defecto
                  </span>
                )}
              </div>
              {d.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{d.description}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span>{d.widget_count} widgets</span>
                <span>•</span>
                <span>{formatRelativeTime(d.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
