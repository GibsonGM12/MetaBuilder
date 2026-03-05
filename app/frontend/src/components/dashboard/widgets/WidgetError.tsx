import { AlertTriangle } from "lucide-react";

interface WidgetErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function WidgetError({ message = "Error al cargar el widget", onRetry }: WidgetErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500" />
      <p className="text-sm text-gray-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
