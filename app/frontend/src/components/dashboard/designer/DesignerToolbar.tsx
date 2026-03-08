import { Eye, Save, X } from "lucide-react";

interface DesignerToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onDiscard: () => void;
  isSaving: boolean;
}

export function DesignerToolbar({
  name,
  onNameChange,
  onSave,
  onPreview,
  onDiscard,
  isSaving,
}: DesignerToolbarProps) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg bg-white p-4 shadow">
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nombre del dashboard"
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Guardando..." : "Guardar"}
      </button>

      <button
        type="button"
        onClick={onPreview}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Eye className="h-4 w-4" />
        Vista previa
      </button>

      <button
        type="button"
        onClick={onDiscard}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
        Descartar
      </button>
    </div>
  );
}
