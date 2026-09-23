export type ThemeColorTokens = {
  Primary100: string;
  Primary300: string;
  Primary400: string;
  Secondary300: string;
  Grey100: string;
  Grey200: string;
  Grey300: string;
  Grey400: string;
  Grey500: string;
  Grey600: string;
  Grey700: string;
  Grey800: string;
  Grey900: string;
  statusR100: string;
  statusR200: string;
  statusG100: string;
  statusG200: string;
  statusG300: string;
  statusB100: string;
  statusB200: string;
  statusY100: string;
  statusY200: string;
  "app-bg": string;
  "app-surface": string;
  "app-text": string;
};

const sharedLightSurface = {
  Grey100: "#F7F8FA",
  Grey200: "#EEF0F3",
  Grey400: "#C0C7D1",
  Grey700: "#4A5565",
  Grey800: "#2F3744",
} as const;

const sharedStatus = {
  statusR100: "#FDECEC",
  statusR200: "#D92D20",
  statusG200: "#039855",
  statusG300: "#027A48",
  statusB100: "#E8F1FB",
  statusB200: "#1570EF",
  statusY100: "#FEF6E7",
  statusY200: "#DC6803",
} as const;

export const lightColorTokens: ThemeColorTokens = {
  ...sharedLightSurface,
  ...sharedStatus,
  Primary100: "#E8EEF5",
  Primary300: "#3D5A80",
  Primary400: "#1B3A5F",
  Secondary300: "#F0E6C8",
  Grey300: "#D9DEE5",
  Grey500: "#9AA3B0",
  Grey600: "#6B7585",
  Grey900: "#1A1F29",
  statusG100: "#E8F7EF",
  "app-bg": "#F5F6F8",
  "app-surface": "#FFFFFF",
  "app-text": "#0A0A0A",
};

export const darkColorTokens: ThemeColorTokens = {
  Primary100: "#1E2A3A",
  Primary300: "#6B8AB0",
  Primary400: "#8FB4DE",
  Secondary300: "#E8D5A3",
  Grey100: "#12151A",
  Grey200: "#1A1F27",
  Grey300: "#2A313C",
  Grey400: "#3D4654",
  Grey500: "#6B7585",
  Grey600: "#9AA3B0",
  Grey700: "#C0C7D1",
  Grey800: "#D9DEE5",
  Grey900: "#EEF0F3",
  statusR100: "#3A1515",
  statusR200: "#F97066",
  statusG100: "#0F2B1E",
  statusG200: "#32D583",
  statusG300: "#6CE9A6",
  statusB100: "#102A43",
  statusB200: "#84CAFF",
  statusY100: "#3A2A10",
  statusY200: "#FDB022",
  "app-bg": "#0B0D11",
  "app-surface": "#151922",
  "app-text": "#F5F6F8",
};

export const authColorTokens: ThemeColorTokens = {
  ...sharedLightSurface,
  ...sharedStatus,
  Primary100: "#E6F4EA",
  Primary300: "#4A7A68",
  Primary400: "#34594C",
  Secondary300: "#1A2C26",
  Grey300: "#D9D9D9",
  Grey500: "#BFBFBF",
  Grey600: "#666666",
  Grey900: "#1F1F1F",
  statusG100: "#E6F4EA",
  "app-bg": "#FFFFFF",
  "app-surface": "#FFFFFF",
  "app-text": "#1F1F1F",
};
