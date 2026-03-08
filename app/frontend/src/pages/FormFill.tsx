import { useParams, Link } from "react-router-dom";
import { FormRenderer } from "../components/forms/renderer/FormRenderer";

export function FormFill() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p className="text-gray-500">Formulario no encontrado</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/forms"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a Formularios
        </Link>
      </div>
      <FormRenderer formId={id} />
    </div>
  );
}
