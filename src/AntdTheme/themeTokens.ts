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
  "sidebar-bg": string;
  "sidebar-text": string;
  "sidebar-active-container": string;
  "brand-surface": string;
};

const sharedStatus = {
  statusR100: "#FDECEA",
  statusR200: "#D92D20",
  statusG200: "#039855",
  statusG300: "#027A48",
  statusB100: "#E6F0FC",
  statusB200: "#1565D8",
  statusY100: "#FEF5E7",
  statusY200: "#DC6803",
} as const;

// ── Light theme ─────────────────────────────────────────────────────────────
// Brand blue  : #1A60B0  (deep royal blue from the building icon)
// Brand gold  : #C8820A  (amber gold from the "CC" letters and "CODE" text)
// Sidebar     : #0C1A2E  (near-black navy — evokes the logo's dark backdrop)
export const lightColorTokens: ThemeColorTokens = {
  ...sharedStatus,
  Primary100: "#E8F0FC",
  Primary300: "#3B80D4",
  Primary400: "#1A60B0",
  Secondary300: "#C8820A",
  Grey100: "#F4F6F9",
  Grey200: "#E8ECF1",
  Grey300: "#CDD4DE",
  Grey400: "#9BAABB",
  Grey500: "#6E7E91",
  Grey600: "#4E5F72",
  Grey700: "#344456",
  Grey800: "#1E2B3A",
  Grey900: "#0E1520",
  statusG100: "#E6F4EE",
  "app-bg": "#F2F5F9",
  "app-surface": "#FFFFFF",
  "app-text": "#0E1520",
  "sidebar-bg": "#0C1A2E",
  "sidebar-text": "#E0E8F4",
  "sidebar-active-container": "#152235",
  // avatar, chips, and any surface that must always read as "brand" in both modes
  "brand-surface": "#1A60B0",
};

// ── Dark theme ───────────────────────────────────────────────────────────────
// App BG      : #060910  (logo near-black)
// App surface : #0C1220
// Primary     : #7EC4F2  (lightened for ANTD dark-algorithm interactive elements)
// Gold        : #E09830  (brightened gold — pops on dark)
// Sidebar     : #091626  (dark navy, visually distinct from app-bg)
export const darkColorTokens: ThemeColorTokens = {
  Primary100: "#0E1C30",
  Primary300: "#58A8E4",
  Primary400: "#7EC4F2",
  Secondary300: "#E09830",
  Grey100: "#07090E",
  Grey200: "#0C1018",
  Grey300: "#161D28",
  Grey400: "#22303F",
  Grey500: "#445568",
  Grey600: "#728594",
  Grey700: "#A0B0BE",
  Grey800: "#C4D0DA",
  Grey900: "#E4ECF2",
  statusR100: "#350F0E",
  statusR200: "#F97066",
  statusG100: "#0A2218",
  statusG200: "#32D583",
  statusG300: "#6CE9A6",
  statusB100: "#0A1E35",
  statusB200: "#84CAFF",
  statusY100: "#2E1E08",
  statusY200: "#FDB022",
  "app-bg": "#060910",
  "app-surface": "#0C1220",
  "app-text": "#E4ECF4",
  "sidebar-bg": "#091626",
  "sidebar-text": "#E0E8F4",
  "sidebar-active-container": "#122038",
  // always stays a deep brand blue regardless of light/dark mode
  "brand-surface": "#1C3E78",
};

// ── Auth theme ───────────────────────────────────────────────────────────────
// Forest-green palette — matches LayoutShowcase (#16241F / #34594C).
// Intentionally independent from the app light/dark brand-blue tokens.
export const authColorTokens: ThemeColorTokens = {
  ...sharedStatus,
  Primary100: "#E6F4EA",
  Primary300: "#4A7A68",
  Primary400: "#34594C",
  Secondary300: "#1A2C26",
  Grey100: "#F4F6F9",
  Grey200: "#EAECF0",
  Grey300: "#D9D9D9",
  Grey400: "#B0BAC6",
  Grey500: "#BFBFBF",
  Grey600: "#666666",
  Grey700: "#3C4E60",
  Grey800: "#243040",
  Grey900: "#1F1F1F",
  statusG100: "#E6F4EA",
  "app-bg": "#FFFFFF",
  "app-surface": "#FFFFFF",
  "app-text": "#1F1F1F",
  "sidebar-bg": "#16241F",
  "sidebar-text": "#E0E8F4",
  "sidebar-active-container": "#1E322A",
  "brand-surface": "#34594C",
};
