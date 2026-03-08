import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { metadataService } from "../services/metadataService";
import type { EntityCreate, FieldCreate } from "../types";

export function useEntities() {
  return useQuery({
    queryKey: ["entities"],
    queryFn: metadataService.getEntities,
  });
}

export function useEntity(id: string | undefined) {
  return useQuery({
    queryKey: ["entities", id],
    queryFn: () => metadataService.getEntity(id!),
    enabled: !!id,
  });
}

export function useCreateEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EntityCreate) => metadataService.createEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });
}

export function useDeleteEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => metadataService.deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
    },
  });
}

export function useAddField(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FieldCreate) => metadataService.addField(entityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities", entityId] });
    },
  });
}

export function useDeleteField(entityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fieldId: string) => metadataService.deleteField(entityId, fieldId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities", entityId] });
    },
  });
}

export function useLookup(entityId: string | undefined, search: string) {
  return useQuery({
    queryKey: ["lookup", entityId, search],
    queryFn: () => metadataService.lookup(entityId!, search),
    enabled: !!entityId,
    staleTime: 30_000,
  });
}

export function useEntityRelationships(entityId: string | undefined) {
  return useQuery({
    queryKey: ["relationships", entityId],
    queryFn: () => metadataService.getRelationships(entityId!),
    enabled: !!entityId,
  });
}
