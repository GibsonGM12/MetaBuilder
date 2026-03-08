import { useParams } from "react-router-dom";
import { FormDesigner } from "../components/forms/designer/FormDesigner";

export function FormDesignerPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <FormDesigner formId={id} />
    </div>
  );
}
