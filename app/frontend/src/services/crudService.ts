import { api } from "./api";
import type { DynamicRecord, PaginatedRecords } from "../types";

export const crudService = {
  getRecords: async (
    entityId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedRecords> => {
    const response = await api.get(
      `/api/entities/${entityId}/records?page=${page}&page_size=${pageSize}`,
    );
    return response.data;
  },

  getRecord: async (
    entityId: string,
    recordId: string,
  ): Promise<DynamicRecord> => {
    const response = await api.get(
      `/api/entities/${entityId}/records/${recordId}`,
    );
    return response.data;
  },

  createRecord: async (
    entityId: string,
    data: Record<string, unknown>,
  ): Promise<DynamicRecord> => {
    const response = await api.post(`/api/entities/${entityId}/records`, {
      data,
    });
    return response.data;
  },

  updateRecord: async (
    entityId: string,
    recordId: string,
    data: Record<string, unknown>,
  ): Promise<DynamicRecord> => {
    const response = await api.put(
      `/api/entities/${entityId}/records/${recordId}`,
      { data },
    );
    return response.data;
  },

  deleteRecord: async (
    entityId: string,
    recordId: string,
  ): Promise<void> => {
    await api.delete(`/api/entities/${entityId}/records/${recordId}`);
  },
};
