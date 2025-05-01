import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataT {
  user: UserT;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: UserT) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

interface UserT {
  full_name?: string;
  username?: string;
  role?: string;
  user_id?: string;
}

export const useAuthStore = create<DataT>()(
  persist(
    (set) => ({
      user: {},
      token: null,
      refreshToken: null,
      setUser: (user: UserT) => {
        set({ user: { ...user, role: "admin" } });
      },
      setToken: (token: string) => set({ token }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
    }),
    {
      name: "auth",
    }
  )
);
