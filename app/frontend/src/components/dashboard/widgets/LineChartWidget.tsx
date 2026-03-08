import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartWidgetProps {
  data: { series: Array<{ label: string; value: number }> };
  config: Record<string, unknown>;
  title: string;
}

export function LineChartWidget({ data, title }: LineChartWidgetProps) {
  const chartData = data.series.map((s) => ({ name: s.label, value: s.value }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
