import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@studyflow/shared";
import { STORAGE_KEYS, storage } from "@studyflow/shared";
import { api } from "@studyflow/api";

interface AuthState {
  // 状态
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 动作
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      logout: () => {
        // 先调 API（logout 不需要 access token，用 refreshToken 即可）
        // 再清 storage，顺序无关紧要因为 logout 不走 JwtAuthGuard 了
        api.auth.logout().catch(() => {});
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
