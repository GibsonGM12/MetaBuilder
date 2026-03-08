import { CheckCircle, Loader2, Send, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useForm, useSubmitForm } from "../../../hooks/useForm";
import type { FormSection } from "../../../types";
import type { FormState } from "../sections/SectionRenderer";
import { SectionRenderer } from "../sections/SectionRenderer";

interface FormRendererProps {
  formId: string;
}

function initialFormState(): FormState {
  return {
    header: {},
    lookups: {},
    detail_lines: [],
    calculated: {},
  };
}

function evaluateCalculated(
  sections: FormSection[],
  detailLines: Array<Record<string, unknown>>,
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const section of sections) {
    if (section.section_type !== "CALCULATED") continue;

    const formula = (section.config.formula as string) ?? "";
    const key = (section.config.key as string) ?? section.id;
    const sumMatch = formula.match(/^SUM\((\w+)\)$/i);
    const avgMatch = formula.match(/^AVG\((\w+)\)$/i);

    if (sumMatch) {
      const fieldName = sumMatch[1];
      result[key] = detailLines.reduce((acc, row) => {
        const val = Number(row[fieldName]);
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
    } else if (avgMatch) {
      const fieldName = avgMatch[1];
      if (detailLines.length === 0) {
        result[key] = 0;
      } else {
        const sum = detailLines.reduce((acc, row) => {
          const val = Number(row[fieldName]);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        result[key] = sum / detailLines.length;
      }
    } else {
      result[key] = 0;
    }
  }

  return result;
}

export function FormRenderer({ formId }: FormRendererProps) {
  const { data: form, isLoading, isError } = useForm(formId);
  const submitForm = useSubmitForm(formId);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const sections = useMemo(
    () =>
      (form?.sections ?? []).slice().sort((a, b) => a.display_order - b.display_order),
    [form],
  );

  const calculated = useMemo(
    () => evaluateCalculated(sections, formState.detail_lines),
    [sections, formState.detail_lines],
  );

  useEffect(() => {
    setFormState((prev) => ({ ...prev, calculated }));
  }, [calculated]);

  const handleSectionChange = (sectionId: string, data: unknown) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    setFormState((prev) => {
      switch (section.section_type) {
        case "FIELDS":
          return { ...prev, header: data as Record<string, unknown> };
        case "LOOKUP":
          return { ...prev, lookups: { ...prev.lookups, [sectionId]: data as string } };
        case "DETAIL_TABLE":
          return { ...prev, detail_lines: data as Array<Record<string, unknown>> };
        default:
          return prev;
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await submitForm.mutateAsync({
        header: formState.header,
        lookups: formState.lookups,
        detail_lines: formState.detail_lines,
      });
      setSubmitted(true);
    } catch {
      // error handled by mutation state
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="ml-2 text-gray-500">Cargando formulario...</span>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500">
        <XCircle className="h-8 w-8" />
        <span className="mt-2 text-sm">Error al cargar el formulario</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h2 className="mt-3 text-lg font-semibold text-gray-800">
          Formulario enviado exitosamente
        </h2>
        <button
          type="button"
          onClick={() => {
            setFormState(initialFormState());
            setSubmitted(false);
          }}
          className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Llenar otro
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      <h1 className="text-xl font-bold text-gray-800">{form.name}</h1>
      {form.description && (
        <p className="text-sm text-gray-500">{form.description}</p>
      )}

      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          formState={formState}
          onChange={handleSectionChange}
        />
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitForm.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {submitForm.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {submitForm.isPending ? "Enviando..." : "Enviar"}
        </button>

        {submitForm.isError && (
          <span className="text-sm text-red-500">
            Error al enviar el formulario. Intenta de nuevo.
          </span>
        )}
      </div>
    </div>
  );
}
