import { useParams, Link } from "react-router-dom";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboard, useAllWidgetsData } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { WidgetRenderer } from "../components/dashboard/widgets/WidgetRenderer";
import type { DashboardWidget } from "../types";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetDataItem {
  widget_id: string;
  data?: unknown;
  error?: string;
}

export function DashboardView() {
  const { id } = useParams<{ id: string }>();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard(id);
  const { data: widgetsData, isLoading: dataLoading } = useAllWidgetsData(id);
  const { isAdmin } = useAuth();

  if (dashboardLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!dashboard) {
    return <p className="text-gray-500">Dashboard no encontrado</p>;
  }

  const dataMap = new Map<string, WidgetDataItem>();
  if (Array.isArray(widgetsData)) {
    for (const item of widgetsData as WidgetDataItem[]) {
      if (item.widget_id) {
        dataMap.set(item.widget_id, item);
      }
    }
  }

  const layout = dashboard.widgets.map((w: DashboardWidget) => ({
    i: w.id,
    x: w.position.x,
    y: w.position.y,
    w: w.position.w,
    h: w.position.h,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboards"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver a Dashboards
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{dashboard.name}</h1>
        </div>
        {isAdmin && (
          <Link
            to={`/admin/dashboards/${id}/edit`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Editar
          </Link>
        )}
      </div>

      {dashboard.widgets.length === 0 ? (
        <p className="text-gray-500">Este dashboard no tiene widgets</p>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 8, sm: 4, xs: 1 }}
          rowHeight={80}
          isDraggable={false}
          isResizable={false}
          margin={[16, 16]}
          layouts={{ lg: layout, md: layout, sm: layout, xs: layout }}
        >
          {dashboard.widgets.map((widget) => {
            const item = dataMap.get(widget.id);
            const data = item?.data;
            const error = item?.error ? new Error(item.error) : null;
            return (
              <div key={widget.id}>
                <WidgetRenderer
                  widget={widget}
                  data={data}
                  isLoading={dataLoading}
                  error={error}
                />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
