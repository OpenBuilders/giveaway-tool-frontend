import { userApi } from "@/api";
import { create } from "zustand";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: "admin" | "user";
  wallet?: string;
};

type UserStore = {
  user: User | null;
  status: "idle" | "loading" | "success" | "error";
  setUser: (user: User) => void;
  setStatus: (status: "idle" | "loading" | "success" | "error") => void;
  updateUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
  updateUser: () => {
    set({ status: "loading" });
    userApi
      .getUser()
      .then((data) => {
        set({
          user: {
            ...data,
          },
          status: "success",
        });
      })
      .catch(() => {
        set({ status: "error" });
      });
  },
}));
