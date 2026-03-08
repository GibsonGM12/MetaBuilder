import { useParams } from "react-router-dom";
import { DashboardDesigner } from "../components/dashboard/designer/DashboardDesigner";

export function DashboardDesignerPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardDesigner dashboardId={id} />
    </div>
  );
}
