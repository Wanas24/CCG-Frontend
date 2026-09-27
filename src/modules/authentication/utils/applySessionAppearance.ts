import i18n from "@/i18n/config";
import { useThemeStore, type AppThemeMode } from "@/AntdTheme";
import type { TUser } from "../types";

const isAppThemeMode = (value: string): value is AppThemeMode =>
  value === "light" || value === "dark";

export const applySessionAppearance = (user: TUser) => {
  if (user.language === "en" || user.language === "ar") {
    void i18n.changeLanguage(user.language);
  }

  if (isAppThemeMode(user.theme)) {
    useThemeStore.getState().setMode(user.theme);
  }
};
