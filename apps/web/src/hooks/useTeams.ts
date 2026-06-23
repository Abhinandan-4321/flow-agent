import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface Team {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  projects: TeamProject[];
}

export interface TeamMember {
  id: string;
  role: string;
  joinedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface TeamProject {
  id: string;
  teamId: string;
  projectId: string;
  addedAt: string;
  project: {
    id: string;
    name: string;
    description?: string;
  };
}

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Team[]>>("/api/teams");
      return res.data.data;
    },
  });
};

export const useTeam = (slug?: string) => {
  return useQuery({
    queryKey: ["team", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await api.get<ApiResponse<Team>>(`/api/teams/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await api.post<ApiResponse<Team>>("/api/teams", data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; description?: string }) => {
      const res = await api.patch<ApiResponse<Team>>(`/api/teams/${id}`, data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", data.slug] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<ApiResponse<{ success: boolean }>>(`/api/teams/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, email, role }: { teamId: string; email: string; role?: string }) => {
      const res = await api.post<ApiResponse<TeamMember>>(`/api/teams/${teamId}/members`, {
        email,
        role,
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId }: { teamId: string; userId: string }) => {
      const res = await api.delete<ApiResponse<{ success: boolean }>>(`/api/teams/${teamId}/members/${userId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useAddProjectToTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, projectId }: { teamId: string; projectId: string }) => {
      const res = await api.post<ApiResponse<TeamProject>>(
        `/api/teams/${teamId}/projects/${projectId}`,
        {}
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useRemoveProjectFromTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, projectId }: { teamId: string; projectId: string }) => {
      const res = await api.delete<ApiResponse<{ success: boolean }>>(
        `/api/teams/${teamId}/projects/${projectId}`
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
