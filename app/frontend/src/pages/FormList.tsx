import { Link } from "react-router-dom";
import { useForms } from "../hooks/useForm";
import { useAuth } from "../hooks/useAuth";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
  return `Hace ${Math.floor(diff / 86400)}d`;
}

export function FormList() {
  const { data: forms, isLoading } = useForms();
  const { isAdmin } = useAuth();

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Formularios</h1>
        {isAdmin && (
          <Link
            to="/admin/forms/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Crear Formulario
          </Link>
        )}
      </div>

      {!forms || forms.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No hay formularios disponibles</p>
          {isAdmin && (
            <Link
              to="/admin/forms/new"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Crear el primero
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Link
              key={form.id}
              to={`/forms/${form.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                {form.name}
              </h3>
              {form.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {form.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>{form.section_count} secciones</span>
                <span>{timeAgo(form.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
