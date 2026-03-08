import { useEntity } from "../../../hooks/useMetadata";
import type { FormSection } from "../../../types";
import { CalculatedSection } from "./CalculatedSection";
import { DetailTableSection } from "./DetailTableSection";
import { FieldsSection } from "./FieldsSection";
import { LookupSection } from "./LookupSection";

export interface FormState {
  header: Record<string, unknown>;
  lookups: Record<string, string>;
  detail_lines: Array<Record<string, unknown>>;
  calculated: Record<string, number>;
}

interface SectionRendererProps {
  section: FormSection;
  formState: FormState;
  onChange: (sectionId: string, data: unknown) => void;
}

export function SectionRenderer({ section, formState, onChange }: SectionRendererProps) {
  const { data: entity } = useEntity(section.entity_id ?? undefined);
  const fields = entity?.fields ?? [];

  const visibleFields =
    section.fields.length > 0
      ? fields.filter((f) =>
          section.fields.some((sf) => sf.entity_field_id === f.id),
        )
      : fields;

  const content = (() => {
    switch (section.section_type) {
      case "FIELDS":
        return (
          <FieldsSection
            fields={visibleFields}
            data={formState.header}
            onChange={(data) => onChange(section.id, data)}
          />
        );

      case "LOOKUP":
        return (
          <LookupSection
            entityId={section.entity_id ?? ""}
            value={formState.lookups[section.id] ?? ""}
            onChange={(val) => onChange(section.id, val)}
            label={section.title}
          />
        );

      case "DETAIL_TABLE":
        return (
          <DetailTableSection
            fields={visibleFields}
            rows={formState.detail_lines}
            onChange={(rows) => onChange(section.id, rows)}
          />
        );

      case "CALCULATED": {
        const key = (section.config.key as string) ?? section.id;
        return (
          <CalculatedSection
            label={section.title}
            value={formState.calculated[key] ?? 0}
            format={(section.config.format as "number" | "currency" | "percentage") ?? "number"}
          />
        );
      }

      default:
        return (
          <div className="text-sm text-gray-400">
            Tipo de sección desconocido: {section.section_type}
          </div>
        );
    }
  })();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {section.section_type !== "CALCULATED" && section.section_type !== "LOOKUP" && (
        <h3 className="mb-3 text-sm font-semibold text-gray-700">{section.title}</h3>
      )}
      {content}
    </div>
  );
}
