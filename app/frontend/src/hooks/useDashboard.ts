import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import type { DashboardCreate, DashboardUpdate, WidgetCreate, WidgetUpdate } from "../types";

export function useDashboards() {
  return useQuery({
    queryKey: ["dashboards"],
    queryFn: dashboardService.getDashboards,
  });
}

export function useDashboard(id: string | undefined) {
  return useQuery({
    queryKey: ["dashboards", id],
    queryFn: () => dashboardService.getDashboard(id!),
    enabled: !!id,
  });
}

export function useDefaultDashboard() {
  return useQuery({
    queryKey: ["dashboards", "default"],
    queryFn: dashboardService.getDefaultDashboard,
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DashboardCreate) => dashboardService.createDashboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DashboardUpdate }) =>
      dashboardService.updateDashboard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dashboardService.deleteDashboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}

export function useAddWidget(dashboardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WidgetCreate) => dashboardService.addWidget(dashboardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards", dashboardId] });
    },
  });
}

export function useUpdateWidget(dashboardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ widgetId, data }: { widgetId: string; data: WidgetUpdate }) =>
      dashboardService.updateWidget(dashboardId, widgetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards", dashboardId] });
    },
  });
}

export function useDeleteWidget(dashboardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (widgetId: string) => dashboardService.deleteWidget(dashboardId, widgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards", dashboardId] });
    },
  });
}

export function useWidgetData(dashboardId: string | undefined, widgetId: string | undefined) {
  return useQuery({
    queryKey: ["widget-data", dashboardId, widgetId],
    queryFn: () => dashboardService.getWidgetData(dashboardId!, widgetId!),
    enabled: !!dashboardId && !!widgetId,
    staleTime: 60_000,
  });
}

export function useAllWidgetsData(dashboardId: string | undefined) {
  return useQuery({
    queryKey: ["widgets-data", dashboardId],
    queryFn: () => dashboardService.getAllWidgetsData(dashboardId!),
    enabled: !!dashboardId,
    staleTime: 60_000,
  });
}
