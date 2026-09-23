import { createTheme, type ThemeCssVariables } from "./themeFactory";
import {
  authColorTokens,
  darkColorTokens,
  lightColorTokens,
} from "./themeTokens";

export type ThemeMode = "light" | "dark" | "auth";

export type CssVariableMap = ThemeCssVariables;

export const lightCssVariables: CssVariableMap = createTheme(lightColorTokens);

export const darkCssVariables: CssVariableMap = createTheme(darkColorTokens);

export const authCssVariables: CssVariableMap = createTheme(authColorTokens);

export const themeCssVariables: Record<ThemeMode, CssVariableMap> = {
  light: lightCssVariables,
  dark: darkCssVariables,
  auth: authCssVariables,
};

export const applyCssVariables = (
  variables: CssVariableMap,
  target: HTMLElement = document.documentElement,
) => {
  Object.entries(variables).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
};
