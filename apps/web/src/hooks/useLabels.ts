import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Label, ApiResponse } from "@/types";

export function useLabels(projectId: string | undefined) {
  return useQuery({
    queryKey: ["labels", projectId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Label[]>>(`/api/projects/${projectId}/labels`);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateLabel(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const res = await api.post<ApiResponse<Label>>(`/api/projects/${projectId}/labels`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["labels", projectId] });
    },
  });
}

export function useDeleteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/labels/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}
