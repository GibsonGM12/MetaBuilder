import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDashboards,
  useDeleteDashboard,
  useUpdateDashboard,
} from "../hooks/useDashboard";

export function DashboardDesignerList() {
  const { data: dashboards, isLoading } = useDashboards();
  const deleteDashboard = useDeleteDashboard();
  const updateDashboard = useUpdateDashboard();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este dashboard? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      await deleteDashboard.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleDefault = async (id: string, current: boolean) => {
    await updateDashboard.mutateAsync({
      id,
      data: { is_default: !current },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Cargando...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Diseñador de Dashboards
        </h1>
        <Link
          to="/admin/dashboards/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Crear Nuevo
        </Link>
      </div>

      {!dashboards?.length ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center">
          <p className="text-gray-500">No hay dashboards creados aún</p>
          <Link
            to="/admin/dashboards/new"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4" />
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Widgets
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Por defecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboards.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {d.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {d.widget_count}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleDefault(d.id, d.is_default)}
                      title={d.is_default ? "Quitar como predeterminado" : "Establecer como predeterminado"}
                    >
                      <Star
                        className={`mx-auto h-5 w-5 ${
                          d.is_default
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(d.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/dashboards/${d.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        disabled={deletingId === d.id}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
