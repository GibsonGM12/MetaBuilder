import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudService } from "../services/crudService";

export function useRecords(
  entityId: string | undefined,
  page: number = 1,
  pageSize: number = 20,
) {
  return useQuery({
    queryKey: ["records", entityId, page, pageSize],
    queryFn: () => crudService.getRecords(entityId!, page, pageSize),
    enabled: !!entityId,
  });
}

export function useCreateRecord(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      crudService.createRecord(entityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
    },
  });
}

export function useUpdateRecord(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      data,
    }: {
      recordId: string;
      data: Record<string, unknown>;
    }) => crudService.updateRecord(entityId, recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
    },
  });
}

export function useDeleteRecord(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      crudService.deleteRecord(entityId, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", entityId] });
    },
  });
}
