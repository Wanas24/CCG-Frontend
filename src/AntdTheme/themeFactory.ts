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
  const { Button, Input, ...otherComponents } = componentOverrides;

  return {
    algorithm,
    token: {
      colorPrimary: cssVariables["--Primary400"],
      colorInfo: cssVariables["--statusB200"],
      colorSuccess: cssVariables["--statusG200"],
      colorWarning: cssVariables["--statusY200"],
      colorError: cssVariables["--statusR200"],
      colorTextBase: cssVariables["--naturalBlack"],
      colorBgBase: cssVariables["--naturalWhite"],
      borderRadius: DesignTokens.radius.md,
      fontFamily: DesignTokens.fontFamily.sans,
      ...tokenOverrides,
    },
    components: {
      Button: {
        controlHeight,
        borderRadius: DesignTokens.radius.md,
        ...Button,
      },
      Input: {
        controlHeight,
        borderRadius: DesignTokens.radius.md,
        ...Input,
      },
      ...otherComponents,
    },
  };
};
