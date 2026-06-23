import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Milestone, ApiResponse } from "@/types";

export function useMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Milestone[]>>(`/api/projects/${projectId}/milestones`);
      return res.data.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateMilestone(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; dueDate?: string }) => {
      const res = await api.post<ApiResponse<Milestone>>(`/api/projects/${projectId}/milestones`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
}

export function useUpdateMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; description?: string; dueDate?: string; status?: string }) => {
      const res = await api.patch<ApiResponse<Milestone>>(`/api/milestones/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

export function useDeleteMilestone() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/milestones/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
