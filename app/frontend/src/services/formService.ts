import { api } from "./api";
import type {
  Form,
  FormCreatePayload,
  FormListItem,
  FormSubmissionData,
  FormSubmissionResult,
  FormUpdatePayload,
} from "../types";

export const formService = {
  getForms: async (): Promise<FormListItem[]> => {
    const response = await api.get("/api/forms");
    return response.data;
  },

  getForm: async (id: string): Promise<Form> => {
    const response = await api.get(`/api/forms/${id}`);
    return response.data;
  },

  createForm: async (data: FormCreatePayload): Promise<Form> => {
    const response = await api.post("/api/forms", data);
    return response.data;
  },

  updateForm: async (id: string, data: FormUpdatePayload): Promise<Form> => {
    const response = await api.put(`/api/forms/${id}`, data);
    return response.data;
  },

  deleteForm: async (id: string): Promise<void> => {
    await api.delete(`/api/forms/${id}`);
  },

  submitForm: async (id: string, data: FormSubmissionData): Promise<FormSubmissionResult> => {
    const response = await api.post(`/api/forms/${id}/submit`, data);
    return response.data;
  },
};
