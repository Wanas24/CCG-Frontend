import { useEffect, useMemo, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import { applyCssVariables, themeCssVariables } from "./cssVariables";
import { useThemeStore } from "./themeStore";
import { darkTheme, lightTheme } from "./themes";
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

  useEffect(() => {
    applyCssVariables(themeCssVariables[mode]);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const theme = useMemo(() => {
    const activeTheme = antdThemes[mode];
    const fontFamily =
      direction === "rtl"
        ? DesignTokens.fontFamily.arabic
        : DesignTokens.fontFamily.sans;

    return {
      ...activeTheme,
      token: { ...activeTheme.token, fontFamily },
    };
  }, [mode, direction]);

  return (
    <ConfigProvider theme={theme} direction={direction} locale={antdLocale}>
      {children}
    </ConfigProvider>
  );
};
