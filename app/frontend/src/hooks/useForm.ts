import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formService } from "../services/formService";
import type { FormCreatePayload, FormSubmissionData, FormUpdatePayload } from "../types";

export function useForms() {
  return useQuery({
    queryKey: ["forms"],
    queryFn: formService.getForms,
  });
}

export function useForm(id: string | undefined) {
  return useQuery({
    queryKey: ["forms", id],
    queryFn: () => formService.getForm(id!),
    enabled: !!id,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormCreatePayload) => formService.createForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormUpdatePayload }) =>
      formService.updateForm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formService.deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useSubmitForm(formId: string) {
  return useMutation({
    mutationFn: (data: FormSubmissionData) => formService.submitForm(formId, data),
  });
}
