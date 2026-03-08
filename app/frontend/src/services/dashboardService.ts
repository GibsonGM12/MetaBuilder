import { api } from "./api";
import type {
  Dashboard,
  DashboardCreate,
  DashboardListItem,
  DashboardUpdate,
  DashboardWidget,
  WidgetCreate,
  WidgetUpdate,
} from "../types";

export const dashboardService = {
  getDashboards: async (): Promise<DashboardListItem[]> => {
    const response = await api.get("/api/dashboards");
    return response.data;
  },

  getDashboard: async (id: string): Promise<Dashboard> => {
    const response = await api.get(`/api/dashboards/${id}`);
    return response.data;
  },

  getDefaultDashboard: async (): Promise<Dashboard | null> => {
    const response = await api.get("/api/dashboards/default");
    return response.data;
  },

  createDashboard: async (data: DashboardCreate): Promise<Dashboard> => {
    const response = await api.post("/api/dashboards", data);
    return response.data;
  },

  updateDashboard: async (id: string, data: DashboardUpdate): Promise<Dashboard> => {
    const response = await api.put(`/api/dashboards/${id}`, data);
    return response.data;
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await api.delete(`/api/dashboards/${id}`);
  },

  addWidget: async (dashboardId: string, data: WidgetCreate): Promise<DashboardWidget> => {
    const response = await api.post(`/api/dashboards/${dashboardId}/widgets`, data);
    return response.data;
  },

  updateWidget: async (
    dashboardId: string,
    widgetId: string,
    data: WidgetUpdate,
  ): Promise<DashboardWidget> => {
    const response = await api.put(`/api/dashboards/${dashboardId}/widgets/${widgetId}`, data);
    return response.data;
  },

  deleteWidget: async (dashboardId: string, widgetId: string): Promise<void> => {
    await api.delete(`/api/dashboards/${dashboardId}/widgets/${widgetId}`);
  },

  getWidgetData: async (dashboardId: string, widgetId: string): Promise<unknown> => {
    const response = await api.get(`/api/dashboards/${dashboardId}/widgets/${widgetId}/data`);
    return response.data;
  },

  getAllWidgetsData: async (dashboardId: string): Promise<unknown[]> => {
    const response = await api.get(`/api/dashboards/${dashboardId}/data`);
    return response.data;
  },
};
