export const DesignTokens = {
  inputs: {
    labelFontSize: "text-sm",
    requiredAsteriskFontSize: "text-sm",
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontFamily: {
    sans: "'IBM Plex Sans', sans-serif",
    arabic: "'IBM Plex Sans Arabic', sans-serif",
  },
} as const;

export type DesignTokensType = typeof DesignTokens;
