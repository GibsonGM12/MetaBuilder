import { Trash2 } from "lucide-react";
import { useEntity } from "../../../hooks/useMetadata";
import type { Entity, SectionType } from "../../../types";

export interface LocalSection {
  id: string;
  section_type: SectionType;
  entity_id: string | null;
  title: string;
  display_order: number;
  config: Record<string, unknown>;
  fields: Array<{ entity_field_id: string | null; config: Record<string, unknown> }>;
}

interface SectionConfigPanelProps {
  section: LocalSection | null;
  entities: Entity[];
  onUpdate: (section: LocalSection) => void;
  onDelete: (sectionId: string) => void;
}

const NEEDS_ENTITY: SectionType[] = ["FIELDS", "LOOKUP", "DETAIL_TABLE"];

export function SectionConfigPanel({
  section,
  entities,
  onUpdate,
  onDelete,
}: SectionConfigPanelProps) {
  const { data: entityData } = useEntity(section?.entity_id ?? undefined);
  const entityFields = entityData?.fields ?? [];

  if (!section) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        Selecciona una sección para configurar
      </div>
    );
  }

  function updateField<K extends keyof LocalSection>(key: K, value: LocalSection[K]) {
    onUpdate({ ...section!, [key]: value });
  }

  function updateConfig(key: string, value: unknown) {
    onUpdate({ ...section!, config: { ...section!.config, [key]: value } });
  }

  function toggleFieldSelection(fieldId: string, checked: boolean) {
    const current = section!.fields;
    const next = checked
      ? [...current, { entity_field_id: fieldId, config: {} }]
      : current.filter((f) => f.entity_field_id !== fieldId);
    updateField("fields", next);
  }

  const selectedFieldIds = new Set(section.fields.map((f) => f.entity_field_id));
  const showEntitySelect = NEEDS_ENTITY.includes(section.section_type);
  const showFieldCheckboxes = section.section_type === "FIELDS" || section.section_type === "DETAIL_TABLE";

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase text-gray-500">
        Configurar Sección
      </h3>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Título</span>
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </label>

      {showEntitySelect && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Entidad</span>
          <select
            value={section.entity_id ?? ""}
            onChange={(e) => {
              onUpdate({ ...section, entity_id: e.target.value || null, fields: [] });
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">— Seleccionar entidad —</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.display_name}
              </option>
            ))}
          </select>
        </label>
      )}

      {showFieldCheckboxes && section.entity_id && (
        <div className="text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            {section.section_type === "FIELDS" ? "Campos" : "Columnas"}
          </span>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-2">
            {entityFields.length === 0 ? (
              <span className="text-xs text-gray-400">Sin campos disponibles</span>
            ) : (
              entityFields.map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.has(f.id)}
                    onChange={(e) => toggleFieldSelection(f.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  {f.display_name}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {section.section_type === "CALCULATED" && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Fórmula</span>
          <input
            type="text"
            value={(section.config.formula as string) ?? ""}
            onChange={(e) => updateConfig("formula", e.target.value)}
            placeholder="SUM(field_name)"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <span className="mt-1 block text-xs text-gray-400">
            Ej: SUM(cantidad), AVG(precio)
          </span>
        </label>
      )}

      {section.section_type === "CALCULATED" && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Formato</span>
          <select
            value={(section.config.format as string) ?? "number"}
            onChange={(e) => updateConfig("format", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="number">Número</option>
            <option value="currency">Moneda</option>
            <option value="percentage">Porcentaje</option>
          </select>
        </label>
      )}

      <button
        type="button"
        onClick={() => onDelete(section.id)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar Sección
      </button>
    </div>
  );
}
