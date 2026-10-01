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
  Grey100: "#F3F5F2",
  Grey200: "#F7F8F5",
  Grey400: "#C6D0CA",
  Grey700: "#4B5953",
  Grey800: "#293831",
} as const;

const sharedStatus = {
  statusR100: "#FCEAEA",
  statusR200: "#C54444",

  statusG200: "#167052",
  statusG300: "#0A4C37",

  statusB100: "#E8F1F5",
  statusB200: "#397A91",

  statusY100: "#FFF7D9",
  statusY200: "#9B6506",
} as const;

export const lightColorTokens: ThemeColorTokens = {
  ...sharedLightSurface,
  ...sharedStatus,

  Primary100: "#DFF5E9",
  Primary300: "#167052",
  Primary400: "#0A4C37",

  Secondary300: "#D5EF50",

  Grey300: "#DFE5E1",
  Grey500: "#A8B4AE",
  Grey600: "#67736E",
  Grey900: "#14211C",

  statusG100: "#DFF5E9",

  "app-bg": "#F3F5F2",
  "app-surface": "#FFFFFF",
  "app-text": "#14211C",
};

export const darkColorTokens: ThemeColorTokens = {
  Primary100: "#163A2D",
  Primary300: "#49C28F",
  Primary400: "#0A4C37",

  Secondary300: "#D5EF50",

  Grey100: "#09110E",
  Grey200: "#101B17",
  Grey300: "#14231E",
  Grey400: "#263831",
  Grey500: "#53645D",
  Grey600: "#9AABA4",
  Grey700: "#B8C6C0",
  Grey800: "#D5E0DB",
  Grey900: "#EDF5F1",

  statusR100: "#321B1B",
  statusR200: "#C54444",

  statusG100: "#163A2D",
  statusG200: "#49C28F",
  statusG300: "#8EE9BD",

  statusB100: "#182A25",
  statusB200: "#72C7A4",

  statusY100: "#332B16",
  statusY200: "#D5A83A",

  "app-bg": "#09110E",
  "app-surface": "#101B17",
  "app-text": "#EDF5F1",
};

