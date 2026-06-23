import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

interface AuthResponse {
  data: { user: User; token: string };
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/api/auth/register", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<AuthResponse>("/api/auth/login", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}
