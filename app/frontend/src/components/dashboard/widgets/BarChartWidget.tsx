import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartWidgetProps {
  data: { series: Array<{ label: string; value: number }> };
  config: Record<string, unknown>;
  title: string;
}

export function BarChartWidget({ data, title }: BarChartWidgetProps) {
  const chartData = data.series.map((s) => ({ name: s.label, value: s.value }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
