import {
  BarChart3,
  GripVertical,
  Hash,
  LineChart,
  List,
  PieChart,
  Table,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { useNavigate } from "react-router-dom";

import {
  useAddWidget,
  useCreateDashboard,
  useDashboard,
  useDeleteWidget,
  useUpdateDashboard,
  useUpdateWidget,
} from "../../../hooks/useDashboard";
import { useEntities } from "../../../hooks/useMetadata";
import type { WidgetType } from "../../../types";
import { DesignerToolbar } from "./DesignerToolbar";
import type { LocalWidget } from "./WidgetConfigPanel";
import { WidgetConfigPanel } from "./WidgetConfigPanel";
import { WidgetPalette } from "./WidgetPalette";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_SIZES: Record<WidgetType, { w: number; h: number }> = {
  STAT_CARD: { w: 3, h: 2 },
  KPI_CARD: { w: 3, h: 2 },
  DATA_GRID: { w: 6, h: 4 },
  BAR_CHART: { w: 6, h: 4 },
  PIE_CHART: { w: 4, h: 4 },
  LINE_CHART: { w: 6, h: 4 },
  RECENT_LIST: { w: 4, h: 4 },
};

const WIDGET_ICONS: Record<WidgetType, React.ReactNode> = {
  STAT_CARD: <Hash className="h-4 w-4" />,
  KPI_CARD: <TrendingUp className="h-4 w-4" />,
  DATA_GRID: <Table className="h-4 w-4" />,
  BAR_CHART: <BarChart3 className="h-4 w-4" />,
  PIE_CHART: <PieChart className="h-4 w-4" />,
  LINE_CHART: <LineChart className="h-4 w-4" />,
  RECENT_LIST: <List className="h-4 w-4" />,
};

const WIDGET_LABELS: Record<WidgetType, string> = {
  STAT_CARD: "Stat Card",
  KPI_CARD: "KPI Card",
  DATA_GRID: "Data Grid",
  BAR_CHART: "Gráfico Barras",
  PIE_CHART: "Gráfico Pastel",
  LINE_CHART: "Gráfico Líneas",
  RECENT_LIST: "Lista Reciente",
};

interface DashboardDesignerProps {
  dashboardId?: string;
  onSaved?: () => void;
}

export function DashboardDesigner({ dashboardId, onSaved }: DashboardDesignerProps) {
  const navigate = useNavigate();
  const { data: entities } = useEntities();
  const { data: existingDashboard } = useDashboard(dashboardId);

  const createDashboard = useCreateDashboard();
  const updateDashboard = useUpdateDashboard();
  const addWidgetMutation = useAddWidget(dashboardId ?? "");
  const updateWidgetMutation = useUpdateWidget(dashboardId ?? "");
  const deleteWidgetMutation = useDeleteWidget(dashboardId ?? "");

  const [dashboardName, setDashboardName] = useState("Nuevo Dashboard");
  const [localWidgets, setLocalWidgets] = useState<LocalWidget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [originalWidgetIds, setOriginalWidgetIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (existingDashboard) {
      setDashboardName(existingDashboard.name);
      const mapped: LocalWidget[] = existingDashboard.widgets.map((w) => ({
        id: w.id,
        entity_id: w.entity_id,
        widget_type: w.widget_type,
        title: w.title,
        position: w.position,
        config: w.config,
      }));
      setLocalWidgets(mapped);
      setOriginalWidgetIds(new Set(existingDashboard.widgets.map((w) => w.id)));
    }
  }, [existingDashboard]);

  const selectedWidget = useMemo(
    () => localWidgets.find((w) => w.id === selectedWidgetId) ?? null,
    [localWidgets, selectedWidgetId],
  );

  const handleAddWidget = useCallback((type: WidgetType) => {
    const size = DEFAULT_SIZES[type];
    const newWidget: LocalWidget = {
      id: crypto.randomUUID(),
      entity_id: "",
      widget_type: type,
      title: WIDGET_LABELS[type],
      position: { x: 0, y: Infinity, w: size.w, h: size.h },
      config: {},
    };
    setLocalWidgets((prev) => [...prev, newWidget]);
    setSelectedWidgetId(newWidget.id);
  }, []);

  const handleUpdateWidget = useCallback((updated: LocalWidget) => {
    setLocalWidgets((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w)),
    );
  }, []);

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      setLocalWidgets((prev) => prev.filter((w) => w.id !== widgetId));
      if (selectedWidgetId === widgetId) setSelectedWidgetId(null);
    },
    [selectedWidgetId],
  );

  const handleLayoutChange = useCallback(
    (layout: { i: string; x: number; y: number; w: number; h: number }[]) => {
      setLocalWidgets((prev) =>
        prev.map((widget) => {
          const item = layout.find((l) => l.i === widget.id);
          if (!item) return widget;
          return {
            ...widget,
            position: { x: item.x, y: item.y, w: item.w, h: item.h },
          };
        }),
      );
    },
    [],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (dashboardId) {
        await updateDashboard.mutateAsync({
          id: dashboardId,
          data: { name: dashboardName },
        });

        const currentIds = new Set(localWidgets.map((w) => w.id));
        const removedIds = [...originalWidgetIds].filter((id) => !currentIds.has(id));
        for (const id of removedIds) {
          await deleteWidgetMutation.mutateAsync(id);
        }

        for (const w of localWidgets) {
          if (originalWidgetIds.has(w.id)) {
            await updateWidgetMutation.mutateAsync({
              widgetId: w.id,
              data: {
                title: w.title,
                position: w.position,
                config: w.config,
                entity_id: w.entity_id,
                widget_type: w.widget_type,
              },
            });
          } else {
            await addWidgetMutation.mutateAsync({
              entity_id: w.entity_id,
              widget_type: w.widget_type,
              title: w.title,
              position: w.position,
              config: w.config,
            });
          }
        }
      } else {
        const created = await createDashboard.mutateAsync({
          name: dashboardName,
        });

        for (const w of localWidgets) {
          await dashboardService_addWidget(created.id, {
            entity_id: w.entity_id,
            widget_type: w.widget_type,
            title: w.title,
            position: w.position,
            config: w.config,
          });
        }
      }

      onSaved?.();
      navigate("/admin/dashboards");
    } catch (err) {
      console.error("Error saving dashboard:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (dashboardId) {
      window.open(`/dashboards/${dashboardId}`, "_blank");
    }
  };

  const handleDiscard = () => {
    navigate("/admin/dashboards");
  };

  const gridLayout = localWidgets.map((w) => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.position.w,
    h: w.position.h,
    minW: 2,
    minH: 2,
  }));

  return (
    <div className="flex h-full flex-col">
      <DesignerToolbar
        name={dashboardName}
        onNameChange={setDashboardName}
        onSave={handleSave}
        onPreview={handlePreview}
        onDiscard={handleDiscard}
        isSaving={isSaving}
      />

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 overflow-auto rounded-lg bg-gray-100 p-4">
          {localWidgets.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Agrega widgets desde el panel derecho
            </div>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: gridLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={60}
              isDraggable
              isResizable
              onLayoutChange={handleLayoutChange}
              draggableHandle=".drag-handle"
            >
              {localWidgets.map((w) => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWidgetId(w.id)}
                  className={`cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md ${
                    selectedWidgetId === w.id
                      ? "ring-2 ring-primary-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="drag-handle flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                    <GripVertical className="h-4 w-4 cursor-grab text-gray-400" />
                    <span className="text-gray-500">{WIDGET_ICONS[w.widget_type]}</span>
                    <span className="flex-1 truncate text-sm font-medium text-gray-700">
                      {w.title}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center p-4 text-xs text-gray-400">
                    {WIDGET_LABELS[w.widget_type]}
                    {w.entity_id ? "" : " — Sin entidad"}
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>

        {/* Right panel */}
        <div className="w-80 shrink-0 overflow-y-auto rounded-lg bg-white p-4 shadow">
          <WidgetPalette onAdd={handleAddWidget} />
          <hr className="my-4 border-gray-200" />
          <WidgetConfigPanel
            widget={selectedWidget}
            entities={entities ?? []}
            onUpdate={handleUpdateWidget}
            onDelete={handleDeleteWidget}
          />
        </div>
      </div>
    </div>
  );
}

async function dashboardService_addWidget(
  dashboardId: string,
  data: {
    entity_id: string;
    widget_type: WidgetType;
    title: string;
    position: { x: number; y: number; w: number; h: number };
    config: Record<string, unknown>;
  },
) {
  const { dashboardService } = await import("../../../services/dashboardService");
  return dashboardService.addWidget(dashboardId, data);
}
