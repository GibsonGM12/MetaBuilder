import { useParams, useNavigate } from "react-router-dom";
import { FieldManager } from "../components/admin/FieldManager";
import { Button } from "../components/common/Button";
import { useEntity } from "../hooks/useMetadata";

export function EntityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: entity, isLoading, error } = useEntity(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !entity) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Entidad no encontrada
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="secondary" size="sm" onClick={() => navigate("/entities")}>
          ← Volver
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{entity.display_name}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Nombre técnico:</span>
            <span className="ml-2 font-mono">{entity.name}</span>
          </div>
          <div>
            <span className="text-gray-500">Tabla:</span>
            <span className="ml-2 font-mono">{entity.table_name}</span>
          </div>
          {entity.description && (
            <div className="col-span-2">
              <span className="text-gray-500">Descripción:</span>
              <span className="ml-2">{entity.description}</span>
            </div>
          )}
        </div>
      </div>

      <FieldManager entityId={entity.id} fields={entity.fields || []} />
    </div>
  );
}
