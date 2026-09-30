export type AppliedThemeMode = "light" | "dark";

export type AppThemeMode = AppliedThemeMode | "system";

export const getSystemPreferredTheme = (): AppliedThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const resolveAppliedTheme = (mode: AppThemeMode): AppliedThemeMode => {
  if (mode === "system") {
    return getSystemPreferredTheme();
  }

  return mode;
};
