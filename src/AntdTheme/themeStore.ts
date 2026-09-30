import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppThemeMode } from "./resolveAppliedTheme";

export type { AppThemeMode };

type ThemeState = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
  toggleMode: () => void;
};

const nextThemeMode = (mode: AppThemeMode): AppThemeMode => {
  if (mode === "light") return "dark";
  if (mode === "dark") return "system";
  return "light";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: nextThemeMode(get().mode) }),
    }),
    {
      name: "ccg-theme-mode",
    },
  ),
);
