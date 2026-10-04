import type { ThemeConfig } from "antd";
import { DesignTokens } from "./DesignTokens";
import type { ThemeColorTokens } from "./themeTokens";

export type CssVariableKey = `--${keyof ThemeColorTokens}`;

export type ThemeCssVariables = Record<CssVariableKey, string>;

export type AntdThemeOptions = {
  algorithm: NonNullable<ThemeConfig["algorithm"]>;
  controlHeight?: number;
  tokenOverrides?: ThemeConfig["token"];
  componentOverrides?: ThemeConfig["components"];
};

export const createTheme = (tokens: ThemeColorTokens): ThemeCssVariables =>
  Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [`--${key}`, value]),
  ) as ThemeCssVariables;

export const createAntdTheme = (
  cssVariables: ThemeCssVariables,
  {
    algorithm,
    controlHeight = 40,
    tokenOverrides,
    componentOverrides = {},
  }: AntdThemeOptions,
): ThemeConfig => {
  const { Button, Input, Card, ...otherComponents } = componentOverrides;

  return {
    algorithm,
    token: {
      colorPrimary: cssVariables["--Primary400"],
      colorInfo: cssVariables["--statusB200"],
      colorSuccess: cssVariables["--statusG200"],
      colorWarning: cssVariables["--statusY200"],
      colorError: cssVariables["--statusR200"],
      colorLink: cssVariables["--Primary400"],
      colorTextBase: cssVariables["--app-text"],
      colorText: cssVariables["--app-text"],
      colorTextSecondary: cssVariables["--Grey600"],
      colorTextTertiary: cssVariables["--Grey500"],
      colorBgBase: cssVariables["--app-bg"],
      colorBgLayout: cssVariables["--app-bg"],
      colorBgContainer: cssVariables["--app-surface"],
      colorBgElevated: cssVariables["--app-surface"],
      colorBorder: cssVariables["--Grey400"],
      colorBorderSecondary: cssVariables["--Grey300"],
      colorSplit: cssVariables["--Grey300"],
      colorPrimaryBg: cssVariables["--Primary100"],
      colorFillAlter: cssVariables["--Grey200"],
      colorFillSecondary: cssVariables["--Grey200"],
      colorFillTertiary: cssVariables["--Grey100"],
      colorFillQuaternary: cssVariables["--Grey100"],
      borderRadius: DesignTokens.radius.md,
      borderRadiusLG: DesignTokens.radius.xl,
      borderRadiusSM: DesignTokens.radius.sm,
      fontFamily: DesignTokens.fontFamily.sans,
      ...tokenOverrides,
    },
    components: {
      Button: {
        borderRadius: DesignTokens.radius.md,
        ...Button,
      },
      Input: {
        controlHeight,
        borderRadius: DesignTokens.radius.md,
        colorBgContainer: cssVariables["--Grey100"],
        ...Input,
      },
      Select: {
        controlHeight,
        borderRadius: DesignTokens.radius.md,
        colorBgContainer: cssVariables["--Grey100"],
      },
      Card: {
        bodyPadding: DesignTokens.Card.bodyPadding,
        ...Card,
      },

      ...otherComponents,
    },
  };
};
