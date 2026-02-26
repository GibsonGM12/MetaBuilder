import { useState } from "react";
import { DynamicForm } from "../components/crud/DynamicForm";
import { DynamicList } from "../components/crud/DynamicList";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { useEntities, useEntity } from "../hooks/useMetadata";
import {
  useRecords,
  useCreateRecord,
  useUpdateRecord,
  useDeleteRecord,
} from "../hooks/useCrud";
import type { DynamicRecord } from "../types";

export function EntityRecords() {
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DynamicRecord | null>(
    null,
  );
  const [deletingRecord, setDeletingRecord] = useState<DynamicRecord | null>(
    null,
  );

  const pageSize = 20;

  const { data: entities, isLoading: loadingEntities } = useEntities();
  const { data: entity } = useEntity(selectedEntityId || undefined);
  const {
    data: recordsData,
    isLoading: loadingRecords,
    isFetching,
  } = useRecords(selectedEntityId || undefined, page, pageSize);

  const createMutation = useCreateRecord(selectedEntityId);
  const updateMutation = useUpdateRecord(selectedEntityId);
  const deleteMutation = useDeleteRecord(selectedEntityId);

  const handleEntityChange = (entityId: string) => {
    setSelectedEntityId(entityId);
    setPage(1);
  };

  const handleCreate = async (data: Record<string, unknown>) => {
    await createMutation.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editingRecord) return;
    await updateMutation.mutateAsync({ recordId: editingRecord.id, data });
    setEditingRecord(null);
  };

  const handleDelete = async () => {
    if (!deletingRecord) return;
    await deleteMutation.mutateAsync(deletingRecord.id);
    setDeletingRecord(null);
  };

  const fields = entity?.fields ?? [];
  const records = recordsData?.items ?? [];
  const total = recordsData?.total ?? 0;
  const totalPages = recordsData?.total_pages ?? 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Datos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona los registros de tus entidades
        </p>
      </div>

      <div className="mb-6 flex items-end gap-4">
        <div className="flex-1 max-w-xs">
          <label
            htmlFor="entity-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Seleccionar entidad
          </label>
          <select
            id="entity-select"
            value={selectedEntityId}
            onChange={(e) => handleEntityChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border px-3 py-2"
            disabled={loadingEntities}
          >
            <option value="">— Selecciona una entidad —</option>
            {entities?.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.display_name}
              </option>
            ))}
          </select>
        </div>

        {selectedEntityId && fields.length > 0 && (
          <Button onClick={() => setShowForm(true)}>+ Nuevo registro</Button>
        )}
      </div>

      {!selectedEntityId && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
            />
          </svg>
          <p className="mt-4 text-gray-500">
            Selecciona una entidad para ver sus registros
          </p>
        </div>
      )}

      {selectedEntityId && fields.length === 0 && !loadingRecords && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            Esta entidad no tiene campos definidos. Agrega campos desde la
            sección de Entidades.
          </p>
        </div>
      )}

      {selectedEntityId && fields.length > 0 && (
        <>
          {loadingRecords && !isFetching ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando registros...</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {total} registro{total !== 1 ? "s" : ""} en total
                </p>
                {isFetching && (
                  <p className="text-sm text-primary-600">Actualizando...</p>
                )}
              </div>

              <DynamicList
                fields={fields}
                records={records}
                onEdit={(record) => setEditingRecord(record)}
                onDelete={(record) => setDeletingRecord(record)}
              />

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600">
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={`Nuevo registro — ${entity?.display_name ?? ""}`}
      >
        <DynamicForm
          fields={fields}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title={`Editar registro — ${entity?.display_name ?? ""}`}
      >
        {editingRecord && (
          <DynamicForm
            fields={fields}
            initialData={editingRecord}
            onSubmit={handleUpdate}
            onCancel={() => setEditingRecord(null)}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        title="Confirmar eliminación"
      >
        <p className="text-sm text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar este registro? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeletingRecord(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
