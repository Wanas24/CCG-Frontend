import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import { applyCssVariables, themeCssVariables } from "./cssVariables";
import { useThemeStore } from "./themeStore";
import { darkTheme, lightTheme } from "./themes";
import { resolveAppliedTheme, type AppliedThemeMode } from "./resolveAppliedTheme";
import { useLocale } from "@/i18n/useLocale";
import { DesignTokens } from "./DesignTokens";

type AppThemeProviderProps = {
  children: ReactNode;
};

const antdThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const mode = useThemeStore((state) => state.mode);
  const { direction, antdLocale } = useLocale();
  const [appliedMode, setAppliedMode] = useState<AppliedThemeMode>(() =>
    resolveAppliedTheme(mode),
  );

  useEffect(() => {
    if (mode !== "system") {
      setAppliedMode(mode);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncAppliedMode = () => {
      setAppliedMode(media.matches ? "dark" : "light");
    };

    syncAppliedMode();
    media.addEventListener("change", syncAppliedMode);

    return () => {
      media.removeEventListener("change", syncAppliedMode);
    };
  }, [mode]);

  useEffect(() => {
    applyCssVariables(themeCssVariables[appliedMode]);
    document.documentElement.dataset.theme = appliedMode;
  }, [appliedMode]);

  const theme = useMemo(() => {
    const activeTheme = antdThemes[appliedMode];
    const fontFamily =
      direction === "rtl"
        ? DesignTokens.fontFamily.arabic
        : DesignTokens.fontFamily.sans;

    return {
      ...activeTheme,
      token: { ...activeTheme.token, fontFamily },
    };
  }, [appliedMode, direction]);

  return (
    <ConfigProvider theme={theme} direction={direction} locale={antdLocale}>
      {children}
    </ConfigProvider>
  );
};
