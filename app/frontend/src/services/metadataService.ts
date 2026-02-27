import { api } from "./api";
import type { Entity, EntityCreate, EntityField, FieldCreate } from "../types";

export const metadataService = {
  getEntities: async (): Promise<Entity[]> => {
    const response = await api.get("/api/metadata/entities");
    return response.data;
  },

  getEntity: async (id: string): Promise<Entity> => {
    const response = await api.get(`/api/metadata/entities/${id}`);
    return response.data;
  },

  createEntity: async (data: EntityCreate): Promise<Entity> => {
    const response = await api.post("/api/metadata/entities", data);
    return response.data;
  },

  updateEntity: async (id: string, data: Partial<EntityCreate>): Promise<Entity> => {
    const response = await api.put(`/api/metadata/entities/${id}`, data);
    return response.data;
  },

  deleteEntity: async (id: string): Promise<void> => {
    await api.delete(`/api/metadata/entities/${id}`);
  },

  addField: async (entityId: string, data: FieldCreate): Promise<EntityField> => {
    const response = await api.post(`/api/metadata/entities/${entityId}/fields`, data);
    return response.data;
  },

  deleteField: async (entityId: string, fieldId: string): Promise<void> => {
    await api.delete(`/api/metadata/entities/${entityId}/fields/${fieldId}`);
  },
};
