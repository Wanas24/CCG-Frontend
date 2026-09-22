export type ThemeMode = "light" | "dark" | "auth";

export type CssVariableMap = Record<string, string>;

/** Light application theme (default). */
export const lightCssVariables: CssVariableMap = {
  "--Primary100": "#E8EEF5",
  "--Primary300": "#3D5A80",
  "--Primary400": "#1B3A5F",
  "--Secondary300": "#F0E6C8",
  "--Grey100": "#F7F8FA",
  "--Grey200": "#EEF0F3",
  "--Grey300": "#D9DEE5",
  "--Grey400": "#C0C7D1",
  "--Grey500": "#9AA3B0",
  "--Grey600": "#6B7585",
  "--Grey700": "#4A5565",
  "--Grey800": "#2F3744",
  "--Grey900": "#1A1F29",
  "--naturalBlack": "#0A0A0A",
  "--naturalWhite": "#FFFFFF",
  "--statusR100": "#FDECEC",
  "--statusR200": "#D92D20",
  "--statusG100": "#E8F7EF",
  "--statusG200": "#039855",
  "--statusG300": "#027A48",
  "--statusB100": "#E8F1FB",
  "--statusB200": "#1570EF",
  "--statusY100": "#FEF6E7",
  "--statusY200": "#DC6803",
  "--app-bg": "#F5F6F8",
  "--app-surface": "#FFFFFF",
  "--app-text": "#0A0A0A",
};

/** Dark application theme (prepared for future switching). */
export const darkCssVariables: CssVariableMap = {
  "--Primary100": "#1E2A3A",
  "--Primary300": "#6B8AB0",
  "--Primary400": "#8FB4DE",
  "--Secondary300": "#E8D5A3",
  "--Grey100": "#12151A",
  "--Grey200": "#1A1F27",
  "--Grey300": "#2A313C",
  "--Grey400": "#3D4654",
  "--Grey500": "#6B7585",
  "--Grey600": "#9AA3B0",
  "--Grey700": "#C0C7D1",
  "--Grey800": "#D9DEE5",
  "--Grey900": "#EEF0F3",
  "--naturalBlack": "#F5F6F8",
  "--naturalWhite": "#0F1218",
  "--statusR100": "#3A1515",
  "--statusR200": "#F97066",
  "--statusG100": "#0F2B1E",
  "--statusG200": "#32D583",
  "--statusG300": "#6CE9A6",
  "--statusB100": "#102A43",
  "--statusB200": "#84CAFF",
  "--statusY100": "#3A2A10",
  "--statusY200": "#FDB022",
  "--app-bg": "#0B0D11",
  "--app-surface": "#151922",
  "--app-text": "#F5F6F8",
};

/**
 * Fixed black-based authentication appearance.
 * Auth pages always use this set and do not follow light/dark switching.
 */
export const authCssVariables: CssVariableMap = {
  "--Primary100": "#1A1A1A",
  "--Primary300": "#4A4A4A",
  "--Primary400": "#FFFFFF",
  "--Secondary300": "#E8D5A3",
  "--Grey100": "#111111",
  "--Grey200": "#1A1A1A",
  "--Grey300": "#2A2A2A",
  "--Grey400": "#3A3A3A",
  "--Grey500": "#6B6B6B",
  "--Grey600": "#9A9A9A",
  "--Grey700": "#C0C0C0",
  "--Grey800": "#DEDEDE",
  "--Grey900": "#F0F0F0",
  "--naturalBlack": "#FFFFFF",
  "--naturalWhite": "#0B0B0B",
  "--statusR100": "#3A1515",
  "--statusR200": "#F97066",
  "--statusG100": "#0F2B1E",
  "--statusG200": "#32D583",
  "--statusG300": "#6CE9A6",
  "--statusB100": "#102A43",
  "--statusB200": "#84CAFF",
  "--statusY100": "#3A2A10",
  "--statusY200": "#FDB022",
  "--app-bg": "#050505",
  "--app-surface": "#121212",
  "--app-text": "#F5F5F5",
};

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
