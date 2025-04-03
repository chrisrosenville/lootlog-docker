import { create } from "zustand";

import { User } from "@/types/user.types";

import { apiClient } from "@/utils/apiClient";
interface AuthState {
  user?: User | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  isLoading: false,
  error: null,

  setUser: (user: User) => set({ user }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),

  checkAuthStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.fetch("/auth/whoami");
      if (res.OK && res.user) {
        set({ user: res.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (err) {
      set({
        user: null,
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to verify authentication",
      });
    }
  },

  logout: async () => {
    try {
      await apiClient.fetch("/auth/sign-out", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({ user: null });
    }
  },
}));
