import {
  BarChart3,
  Hash,
  LineChart,
  List,
  PieChart,
  Table,
  TrendingUp,
} from "lucide-react";
import type { WidgetType } from "../../../types";

const WIDGET_OPTIONS: { type: WidgetType; label: string; icon: React.ReactNode }[] = [
  { type: "STAT_CARD", label: "Stat Card", icon: <Hash className="h-4 w-4" /> },
  { type: "KPI_CARD", label: "KPI Card", icon: <TrendingUp className="h-4 w-4" /> },
  { type: "DATA_GRID", label: "Data Grid", icon: <Table className="h-4 w-4" /> },
  { type: "BAR_CHART", label: "Gráfico Barras", icon: <BarChart3 className="h-4 w-4" /> },
  { type: "PIE_CHART", label: "Gráfico Pastel", icon: <PieChart className="h-4 w-4" /> },
  { type: "LINE_CHART", label: "Gráfico Líneas", icon: <LineChart className="h-4 w-4" /> },
  { type: "RECENT_LIST", label: "Lista Reciente", icon: <List className="h-4 w-4" /> },
];

interface WidgetPaletteProps {
  onAdd: (type: WidgetType) => void;
}

export function WidgetPalette({ onAdd }: WidgetPaletteProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        Agregar Widget
      </h3>
      <div className="flex flex-col gap-1">
        {WIDGET_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => onAdd(opt.type)}
            className="flex w-full items-center gap-2 rounded p-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
