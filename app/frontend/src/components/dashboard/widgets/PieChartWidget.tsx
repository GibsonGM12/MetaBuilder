import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

interface PieChartWidgetProps {
  data: { series: Array<{ label: string; value: number }> };
  config: Record<string, unknown>;
  title: string;
}

export function PieChartWidget({ data, title }: PieChartWidgetProps) {
  const chartData = data.series.map((s, i) => ({
    name: s.label,
    value: s.value,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
