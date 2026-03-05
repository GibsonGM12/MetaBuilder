import { Trash2 } from "lucide-react";
import { useEntity } from "../../../hooks/useMetadata";
import type { Entity, EntityField, WidgetType } from "../../../types";

export interface LocalWidget {
  id: string;
  entity_id: string;
  widget_type: WidgetType;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
}

interface WidgetConfigPanelProps {
  widget: LocalWidget | null;
  entities: Entity[];
  onUpdate: (widget: LocalWidget) => void;
  onDelete: (widgetId: string) => void;
}

const COLOR_OPTIONS = ["blue", "green", "red", "yellow", "purple", "indigo"];
const ICON_OPTIONS = ["package", "users", "shopping-cart", "dollar-sign", "activity", "box"];
const AGGREGATION_OPTIONS = [
  { value: "count", label: "Contar" },
  { value: "sum", label: "Suma" },
  { value: "avg", label: "Promedio" },
];
const FORMAT_OPTIONS = [
  { value: "number", label: "Número" },
  { value: "currency", label: "Moneda" },
  { value: "percentage", label: "Porcentaje" },
];
const PAGE_SIZE_OPTIONS = [5, 10, 20];
const INTERVAL_OPTIONS = [
  { value: "day", label: "Día" },
  { value: "week", label: "Semana" },
  { value: "month", label: "Mes" },
];
const LIMIT_OPTIONS = [3, 5, 10];

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        <option value="">— Seleccionar —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function fieldOptions(fields: EntityField[] | undefined) {
  return (fields ?? []).map((f) => ({ value: f.name, label: f.display_name }));
}

function dateFields(fields: EntityField[] | undefined) {
  const base = (fields ?? [])
    .filter((f) => f.field_type === "DATE")
    .map((f) => ({ value: f.name, label: f.display_name }));
  return [{ value: "created_at", label: "Fecha de creación" }, ...base];
}

function numberFields(fields: EntityField[] | undefined) {
  return (fields ?? [])
    .filter((f) => f.field_type === "NUMBER" || f.field_type === "INTEGER")
    .map((f) => ({ value: f.name, label: f.display_name }));
}

export function WidgetConfigPanel({
  widget,
  entities,
  onUpdate,
  onDelete,
}: WidgetConfigPanelProps) {
  const { data: entityData } = useEntity(widget?.entity_id || undefined);
  const fields = entityData?.fields;

  if (!widget) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        Selecciona un widget para configurar
      </div>
    );
  }

  const cfg = widget.config;

  function updateConfig(key: string, value: unknown) {
    onUpdate({ ...widget!, config: { ...widget!.config, [key]: value } });
  }

  function updateField(key: keyof LocalWidget, value: unknown) {
    onUpdate({ ...widget!, [key]: value });
  }

  function toggleCheckbox(key: string, fieldName: string, checked: boolean) {
    const current = (cfg[key] as string[]) ?? [];
    const next = checked
      ? [...current, fieldName]
      : current.filter((n) => n !== fieldName);
    updateConfig(key, next);
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase text-gray-500">
        Configurar Widget
      </h3>

      {/* Title */}
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Título</span>
        <input
          type="text"
          value={widget.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </label>

      {/* Entity */}
      <SelectField
        label="Entidad"
        value={widget.entity_id}
        options={entities.map((e) => ({ value: e.id, label: e.display_name }))}
        onChange={(val) => updateField("entity_id", val)}
      />

      {/* Type-specific config */}
      {widget.widget_type === "STAT_CARD" && (
        <>
          <SelectField
            label="Agregación"
            value={(cfg.aggregation as string) ?? ""}
            options={AGGREGATION_OPTIONS}
            onChange={(v) => updateConfig("aggregation", v)}
          />
          <SelectField
            label="Campo"
            value={(cfg.field as string) ?? ""}
            options={fieldOptions(fields)}
            onChange={(v) => updateConfig("field", v)}
          />
          <SelectField
            label="Color"
            value={(cfg.color as string) ?? ""}
            options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))}
            onChange={(v) => updateConfig("color", v)}
          />
          <SelectField
            label="Icono"
            value={(cfg.icon as string) ?? ""}
            options={ICON_OPTIONS.map((i) => ({ value: i, label: i }))}
            onChange={(v) => updateConfig("icon", v)}
          />
        </>
      )}

      {widget.widget_type === "KPI_CARD" && (
        <>
          <SelectField
            label="Agregación"
            value={(cfg.aggregation as string) ?? ""}
            options={AGGREGATION_OPTIONS}
            onChange={(v) => updateConfig("aggregation", v)}
          />
          <SelectField
            label="Campo"
            value={(cfg.field as string) ?? ""}
            options={fieldOptions(fields)}
            onChange={(v) => updateConfig("field", v)}
          />
          <SelectField
            label="Formato"
            value={(cfg.format as string) ?? ""}
            options={FORMAT_OPTIONS}
            onChange={(v) => updateConfig("format", v)}
          />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Etiqueta</span>
            <input
              type="text"
              value={(cfg.label as string) ?? ""}
              onChange={(e) => updateConfig("label", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </label>
        </>
      )}

      {widget.widget_type === "DATA_GRID" && (
        <>
          <div className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Columnas</span>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {(fields ?? []).map((f) => {
                const columns = (cfg.columns as string[]) ?? [];
                return (
                  <label key={f.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={columns.includes(f.name)}
                      onChange={(e) =>
                        toggleCheckbox("columns", f.name, e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    {f.display_name}
                  </label>
                );
              })}
            </div>
          </div>
          <SelectField
            label="Registros por página"
            value={String((cfg.pageSize as number) ?? "")}
            options={PAGE_SIZE_OPTIONS.map((s) => ({
              value: String(s),
              label: String(s),
            }))}
            onChange={(v) => updateConfig("pageSize", Number(v))}
          />
        </>
      )}

      {widget.widget_type === "BAR_CHART" && (
        <>
          <SelectField
            label="Agrupar por"
            value={(cfg.groupBy as string) ?? ""}
            options={fieldOptions(fields)}
            onChange={(v) => updateConfig("groupBy", v)}
          />
          <SelectField
            label="Agregación"
            value={(cfg.aggregation as string) ?? ""}
            options={AGGREGATION_OPTIONS}
            onChange={(v) => updateConfig("aggregation", v)}
          />
          <SelectField
            label="Campo"
            value={(cfg.field as string) ?? ""}
            options={fieldOptions(fields)}
            onChange={(v) => updateConfig("field", v)}
          />
        </>
      )}

      {widget.widget_type === "PIE_CHART" && (
        <>
          <SelectField
            label="Agrupar por"
            value={(cfg.groupBy as string) ?? ""}
            options={fieldOptions(fields)}
            onChange={(v) => updateConfig("groupBy", v)}
          />
          <SelectField
            label="Agregación"
            value={(cfg.aggregation as string) ?? ""}
            options={AGGREGATION_OPTIONS}
            onChange={(v) => updateConfig("aggregation", v)}
          />
        </>
      )}

      {widget.widget_type === "LINE_CHART" && (
        <>
          <SelectField
            label="Eje X"
            value={(cfg.xAxis as string) ?? ""}
            options={dateFields(fields)}
            onChange={(v) => updateConfig("xAxis", v)}
          />
          <SelectField
            label="Eje Y"
            value={(cfg.yAxis as string) ?? ""}
            options={numberFields(fields)}
            onChange={(v) => updateConfig("yAxis", v)}
          />
          <SelectField
            label="Agregación"
            value={(cfg.aggregation as string) ?? ""}
            options={AGGREGATION_OPTIONS}
            onChange={(v) => updateConfig("aggregation", v)}
          />
          <SelectField
            label="Intervalo"
            value={(cfg.interval as string) ?? ""}
            options={INTERVAL_OPTIONS}
            onChange={(v) => updateConfig("interval", v)}
          />
        </>
      )}

      {widget.widget_type === "RECENT_LIST" && (
        <>
          <div className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Campos</span>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {(fields ?? []).map((f) => {
                const selected = (cfg.fields as string[]) ?? [];
                return (
                  <label key={f.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.includes(f.name)}
                      onChange={(e) =>
                        toggleCheckbox("fields", f.name, e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    {f.display_name}
                  </label>
                );
              })}
            </div>
          </div>
          <SelectField
            label="Límite"
            value={String((cfg.limit as number) ?? "")}
            options={LIMIT_OPTIONS.map((l) => ({
              value: String(l),
              label: String(l),
            }))}
            onChange={(v) => updateConfig("limit", Number(v))}
          />
        </>
      )}

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(widget.id)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar Widget
      </button>
    </div>
  );
}
