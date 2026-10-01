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
  layout: {
    identitySplit: "flex flex-col gap-6 lg:flex-row lg:items-start",
    identitySidebar: "flex w-full shrink-0 flex-col gap-6 lg:w-72",
    identityMain: "flex min-w-0 flex-1 flex-col gap-6",
    switcherTrigger: "flex min-w-0 max-w-56 items-center gap-2",
    switcherMenu: "flex w-72 max-w-[calc(100vw-1.5rem)] flex-col p-1",
  },
  typography: {
    headingSm: "text-base font-semibold text-(--app-text)",
    emphasis: "font-semibold text-(--app-text)",
    muted: "text-(--Grey600)",
  },
  media: {
    avatarLg: "size-28",
    avatarLgPx: 112,
    avatarSm: "size-8",
    iconMd: 22,
    iconSm: 16,
  },
} as const;

export type DesignTokensType = typeof DesignTokens;
