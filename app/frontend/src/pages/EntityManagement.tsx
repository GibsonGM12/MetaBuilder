import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EntityBuilder } from "../components/admin/EntityBuilder";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { useDeleteEntity, useEntities } from "../hooks/useMetadata";
import type { Entity } from "../types";

export function EntityManagement() {
  const [showCreate, setShowCreate] = useState(false);
  const { data: entities, isLoading, error } = useEntities();
  const deleteEntity = useDeleteEntity();
  const navigate = useNavigate();

  const handleDelete = async (entity: Entity) => {
    if (window.confirm(`¿Eliminar la entidad "${entity.display_name}"? Esta acción no se puede deshacer.`)) {
      deleteEntity.mutate(entity.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        Error al cargar entidades
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Entidades</h2>
        <Button onClick={() => setShowCreate(true)}>Nueva Entidad</Button>
      </div>

      {entities?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay entidades</h3>
          <p className="mt-2 text-gray-500">Crea tu primera entidad para comenzar.</p>
          <Button className="mt-4" onClick={() => setShowCreate(true)}>Crear Entidad</Button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tabla</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entities?.map((entity) => (
                <tr key={entity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entity.display_name}</div>
                    <div className="text-sm text-gray-500">{entity.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {entity.description || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {entity.table_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/entities/${entity.id}`)}>
                      Campos
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(entity)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nueva Entidad">
        <EntityBuilder onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  );
}
