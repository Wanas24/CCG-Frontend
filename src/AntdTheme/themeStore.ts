import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "./cssVariables";

export type AppThemeMode = Exclude<ThemeMode, "auth">;

type ThemeState = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === "light" ? "dark" : "light" }),
    }),
    {
      name: "alharmeen-theme-mode",
    },
  ),
);
