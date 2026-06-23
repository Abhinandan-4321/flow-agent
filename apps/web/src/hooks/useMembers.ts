import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ProjectMember, User, ApiResponse } from "@/types";

export function useAddMember(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post<ApiResponse<ProjectMember>>(`/api/projects/${projectId}/members`, { email });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project"] });
    },
  });
}

export function useUpdateMemberRole(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await api.patch<ApiResponse<ProjectMember>>(`/api/projects/${projectId}/members/${userId}`, { role });
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project"] });
    },
  });
}

export function useRemoveMember(projectId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/api/projects/${projectId}/members/${userId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project"] });
    },
  });
}

export function useSearchUsers() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.get<ApiResponse<User[]>>(`/api/users/search?email=${encodeURIComponent(email)}`);
      return res.data.data;
    },
  });
}
