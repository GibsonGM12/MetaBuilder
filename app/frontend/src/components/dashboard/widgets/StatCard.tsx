import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Box,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  package: Package,
  users: Users,
  "shopping-cart": ShoppingCart,
  "dollar-sign": DollarSign,
  activity: Activity,
  box: Box,
};

const COLOR_CLASSES: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  green: { bg: "bg-green-50", text: "text-green-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700" },
};

interface StatCardProps {
  data: { value: number };
  config: Record<string, unknown>;
  title: string;
}

export function StatCard({ data, config, title }: StatCardProps) {
  const iconKey = (config.icon as string)?.toLowerCase?.() ?? "package";
  const IconComponent = ICON_MAP[iconKey] ?? Package;
  const colorKey = ((config.color as string) ?? "blue").toLowerCase();
  const colors = COLOR_CLASSES[colorKey] ?? COLOR_CLASSES.blue;

  return (
    <div className={`rounded-lg p-4 ${colors.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-3xl font-bold ${colors.text}`}>
            {data.value.toLocaleString()}
          </p>
          <p className={`mt-1 text-sm font-medium ${colors.text} opacity-90`}>
            {title}
          </p>
        </div>
        <IconComponent className={`h-10 w-10 ${colors.text} opacity-80`} />
      </div>
    </div>
  );
}
