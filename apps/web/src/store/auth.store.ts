import { create } from "zustand";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("flowagent_token"),
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    localStorage.setItem("flowagent_token", token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("flowagent_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = localStorage.getItem("flowagent_token");
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { data } = await api.get("/api/auth/me");
      set({ user: data.data, token, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem("flowagent_token");
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
