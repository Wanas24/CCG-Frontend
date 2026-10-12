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

const sharedBrand = {
  Primary300: "#6d7cff",
  Primary400: "#063264",

  Secondary300: "#a26bff",

  statusR200: "#f04461",

  statusG200: "#22c55e",
  statusG300: "#22c55e",

  statusB200: "#14b8a6",

  statusY200: "#f59e0b",
} as const;

export const lightColorTokens: ThemeColorTokens = {
  ...sharedBrand,

  Primary100: "#edefff",

  Grey100: "#eaeef8",
  Grey200: "#f6f8fd",
  Grey300: "#e2e7f3",
  Grey400: "#cfd7ea",
  Grey500: "#97a1bf",
  Grey600: "#5b678c",
  Grey700: "#5b678c",
  Grey800: "#141b34",
  Grey900: "#141b34",

  statusR100: "#fdecef",

  statusG100: "#e9f9ef",

  statusB100: "#e8f8f6",

  statusY100: "#fef5e7",

  "app-bg": "#f3f5fb",
  "app-surface": "#ffffff",
  "app-text": "#141b34",
};

export const darkColorTokens: ThemeColorTokens = {
  ...sharedBrand,

  Primary100: "#1c2748",
  Primary400: "#8b9aff",

  Grey100: "#0e1528",
  Grey200: "#16213c",
  Grey300: "#2a3a5c",
  Grey400: "#3d4f75",
  Grey500: "#a8b4d6",
  Grey600: "#c5cde8",
  Grey700: "#d5dcf2",
  Grey800: "#eef1ff",
  Grey900: "#f5f7ff",

  statusR100: "#271e35",

  statusG100: "#132b35",

  statusB100: "#112a3c",

  statusY100: "#28272c",

  "app-bg": "#0a0f1e",
  "app-surface": "#111a30",
  "app-text": "#f5f7ff",
};

