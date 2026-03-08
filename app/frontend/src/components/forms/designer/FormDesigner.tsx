import { ArrowDown, ArrowUp, Eye, GripVertical, Save, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateForm, useForm, useUpdateForm } from "../../../hooks/useForm";
import { useEntities } from "../../../hooks/useMetadata";
import type { SectionType } from "../../../types";
import type { LocalSection } from "./SectionConfigPanel";
import { SectionConfigPanel } from "./SectionConfigPanel";
import { SectionPalette } from "./SectionPalette";

const SECTION_LABELS: Record<SectionType, string> = {
  FIELDS: "Campos",
  LOOKUP: "Búsqueda",
  DETAIL_TABLE: "Tabla Detalle",
  CALCULATED: "Calculado",
};

interface FormDesignerProps {
  formId?: string;
}

export function FormDesigner({ formId }: FormDesignerProps) {
  const navigate = useNavigate();
  const { data: entities } = useEntities();
  const { data: existingForm } = useForm(formId);

  const createForm = useCreateForm();
  const updateForm = useUpdateForm();

  const [formName, setFormName] = useState("Nuevo Formulario");
  const [primaryEntityId, setPrimaryEntityId] = useState("");
  const [localSections, setLocalSections] = useState<LocalSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingForm) {
      setFormName(existingForm.name);
      setPrimaryEntityId(existingForm.primary_entity_id);
      setLocalSections(
        existingForm.sections.map((s) => ({
          id: s.id,
          section_type: s.section_type,
          entity_id: s.entity_id,
          title: s.title,
          display_order: s.display_order,
          config: s.config,
          fields: s.fields.map((f) => ({
            entity_field_id: f.entity_field_id,
            config: f.config,
          })),
        })),
      );
    }
  }, [existingForm]);

  const selectedSection = useMemo(
    () => localSections.find((s) => s.id === selectedSectionId) ?? null,
    [localSections, selectedSectionId],
  );

  const handleAddSection = useCallback((type: SectionType) => {
    const needsEntity = (["FIELDS", "LOOKUP", "DETAIL_TABLE"] as SectionType[]).includes(type);
    const newSection: LocalSection = {
      id: crypto.randomUUID(),
      section_type: type,
      entity_id: needsEntity ? primaryEntityId || null : null,
      title: SECTION_LABELS[type],
      display_order: 0,
      config: {},
      fields: [],
    };
    setLocalSections((prev) => {
      const updated = [...prev, newSection];
      return updated.map((s, i) => ({ ...s, display_order: i }));
    });
    setSelectedSectionId(newSection.id);
  }, [primaryEntityId]);

  const handleUpdateSection = useCallback((updated: LocalSection) => {
    setLocalSections((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  }, []);

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      setLocalSections((prev) => {
        const filtered = prev.filter((s) => s.id !== sectionId);
        return filtered.map((s, i) => ({ ...s, display_order: i }));
      });
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
    },
    [selectedSectionId],
  );

  const handleMoveSection = useCallback((index: number, direction: "up" | "down") => {
    setLocalSections((prev) => {
      const next = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((s, i) => ({ ...s, display_order: i }));
    });
  }, []);

  const handleSave = async () => {
    if (!formName.trim() || !primaryEntityId) return;
    setIsSaving(true);
    try {
      const sectionsPayload = localSections.map((s) => ({
        section_type: s.section_type,
        entity_id: s.entity_id ?? undefined,
        title: s.title,
        config: s.config,
        fields: s.fields.map((f) => ({
          entity_field_id: f.entity_field_id ?? undefined,
          config: f.config,
        })),
      }));

      if (formId) {
        await updateForm.mutateAsync({
          id: formId,
          data: { name: formName, sections: sectionsPayload },
        });
      } else {
        await createForm.mutateAsync({
          name: formName,
          primary_entity_id: primaryEntityId,
          sections: sectionsPayload,
        });
      }

      navigate("/admin/forms");
    } catch (err) {
      console.error("Error saving form:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (formId) {
      window.open(`/forms/${formId}`, "_blank");
    }
  };

  const handleDiscard = () => {
    navigate("/admin/forms");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Nombre del formulario"
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <select
          value={primaryEntityId}
          onChange={(e) => setPrimaryEntityId(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">— Entidad principal —</option>
          {(entities ?? []).map((e) => (
            <option key={e.id} value={e.id}>
              {e.display_name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !formName.trim() || !primaryEntityId}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar"}
        </button>

        {formId && (
          <button
            type="button"
            onClick={handlePreview}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            Vista previa
          </button>
        )}

        <button
          type="button"
          onClick={handleDiscard}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
          Descartar
        </button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left panel – section list */}
        <div className="flex-1 overflow-auto rounded-lg bg-gray-100 p-4">
          {localSections.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              Agrega secciones desde el panel derecho
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {localSections.map((section, index) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
                    selectedSectionId === section.id
                      ? "ring-2 ring-primary-500"
                      : "border-gray-200"
                  }`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-700">
                      {section.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {SECTION_LABELS[section.section_type]}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(index, "up");
                      }}
                      disabled={index === 0}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(index, "down");
                      }}
                      disabled={index === localSections.length - 1}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-80 shrink-0 overflow-y-auto rounded-lg bg-white p-4 shadow">
          <SectionPalette onAdd={handleAddSection} />
          <hr className="my-4 border-gray-200" />
          <SectionConfigPanel
            section={selectedSection}
            entities={entities ?? []}
            onUpdate={handleUpdateSection}
            onDelete={handleDeleteSection}
          />
        </div>
      </div>
    </div>
  );
}
