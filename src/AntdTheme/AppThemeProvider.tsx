import { useEffect, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import { applyCssVariables, themeCssVariables } from "./cssVariables";
import { useThemeStore } from "./themeStore";
import { lightTheme } from "./themes/lightTheme";
import { darkTheme } from "./themes/darkTheme";
import { useLocale } from "@/i18n/useLocale";
import { DesignTokens } from "./DesignTokens";

type AppThemeProviderProps = {
  children: ReactNode;
};

const antdThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

/**
 * Root theme provider for application surfaces.
 * Auth layouts nest their own ConfigProvider with the fixed auth theme.
 */
export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const mode = useThemeStore((state) => state.mode);
  const { direction, antdLocale } = useLocale();

  useEffect(() => {
    applyCssVariables(themeCssVariables[mode]);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const activeTheme = antdThemes[mode];
  const fontFamily =
    direction === "rtl"
      ? DesignTokens.fontFamily.arabic
      : DesignTokens.fontFamily.sans;

  return (
    <ConfigProvider
      theme={{
        ...activeTheme,
        token: { ...activeTheme.token, fontFamily },
      }}
      direction={direction}
      locale={antdLocale}
    >
      {children}
    </ConfigProvider>
  );
};
