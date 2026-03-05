import { Calculator, List, Search, Table } from "lucide-react";
import type { SectionType } from "../../../types";

const SECTION_OPTIONS: { type: SectionType; label: string; icon: React.ReactNode }[] = [
  { type: "FIELDS", label: "Campos", icon: <List className="h-4 w-4" /> },
  { type: "LOOKUP", label: "Búsqueda", icon: <Search className="h-4 w-4" /> },
  { type: "DETAIL_TABLE", label: "Tabla Detalle", icon: <Table className="h-4 w-4" /> },
  { type: "CALCULATED", label: "Calculado", icon: <Calculator className="h-4 w-4" /> },
];

interface SectionPaletteProps {
  onAdd: (type: SectionType) => void;
}

export function SectionPalette({ onAdd }: SectionPaletteProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        Agregar Sección
      </h3>
      <div className="flex flex-col gap-1">
        {SECTION_OPTIONS.map((opt) => (
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
