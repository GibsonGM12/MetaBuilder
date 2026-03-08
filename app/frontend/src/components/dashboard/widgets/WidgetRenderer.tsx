import type { DashboardWidget } from "../../../types";
import { WidgetSkeleton } from "./WidgetSkeleton";
import { WidgetError } from "./WidgetError";
import { StatCard } from "./StatCard";
import { KpiCard } from "./KpiCard";
import { DataGridWidget } from "./DataGridWidget";
import { BarChartWidget } from "./BarChartWidget";
import { PieChartWidget } from "./PieChartWidget";
import { LineChartWidget } from "./LineChartWidget";
import { RecentListWidget } from "./RecentListWidget";

interface WidgetRendererProps {
  widget: DashboardWidget;
  data: unknown;
  isLoading: boolean;
  error: unknown;
  onRetry?: () => void;
}

export function WidgetRenderer({
  widget,
  data,
  isLoading,
  error,
  onRetry,
}: WidgetRendererProps) {
  const errorMessage = error instanceof Error ? error.message : "Error al cargar el widget";

  return (
    <div className="h-full rounded-lg bg-white p-4 shadow">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{widget.title}</h3>
      {isLoading && <WidgetSkeleton />}
      {!isLoading && error ? (
        <WidgetError message={errorMessage} onRetry={onRetry} />
      ) : null}
      {!isLoading && !error && (
        <>
          {widget.widget_type === "STAT_CARD" && (
            <StatCard
              data={data as { value: number }}
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "KPI_CARD" && (
            <KpiCard
              data={data as { value: number; format?: string; label?: string }}
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "DATA_GRID" && (
            <DataGridWidget
              data={
                data as {
                  columns: Array<{ name: string; display_name: string; field_type: string }>;
                  items: Array<Record<string, unknown>>;
                  total: number;
                  page_size: number;
                }
              }
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "BAR_CHART" && (
            <BarChartWidget
              data={data as { series: Array<{ label: string; value: number }> }}
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "PIE_CHART" && (
            <PieChartWidget
              data={data as { series: Array<{ label: string; value: number }> }}
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "LINE_CHART" && (
            <LineChartWidget
              data={data as { series: Array<{ label: string; value: number }> }}
              config={widget.config}
              title={widget.title}
            />
          )}
          {widget.widget_type === "RECENT_LIST" && (
            <RecentListWidget
              data={data as { items: Array<Record<string, unknown>> }}
              config={widget.config}
              title={widget.title}
            />
          )}
        </>
      )}
    </div>
  );
}
