import { Link } from "react-router-dom";
import { useForms, useDeleteForm } from "../hooks/useForm";

export function FormDesignerList() {
  const { data: forms, isLoading } = useForms();
  const deleteForm = useDeleteForm();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar el formulario "${name}"?`)) {
      deleteForm.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Diseñador de Formularios</h1>
        <Link
          to="/admin/forms/new"
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Crear Nuevo
        </Link>
      </div>

      {!forms || forms.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">No hay formularios creados</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Secciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {form.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {form.section_count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(form.created_at).toLocaleDateString("es-MX")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/forms/${form.id}/edit`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(form.id, form.name)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
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
