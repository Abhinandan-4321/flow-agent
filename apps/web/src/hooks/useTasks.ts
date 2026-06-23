import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Task, ApiResponse } from "@/types";

export function useTasks(projectId: string | undefined, filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const res = await api.get<ApiResponse<Task[]>>(`/api/projects/${projectId}/tasks?${params}`);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Task>>(`/api/tasks/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const res = await api.post<ApiResponse<Task>>(`/api/projects/${projectId}/tasks`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Task>) => {
      const res = await api.patch<ApiResponse<Task>>(`/api/tasks/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", variables.id] });
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.patch<ApiResponse<Task>>(`/api/tasks/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskPosition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, position }: { id: string; position: number }) => {
      const res = await api.patch<ApiResponse<Task>>(`/api/tasks/${id}/position`, { position });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
