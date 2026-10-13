import type { TAlertUiStatus } from "../types";

export const ALERT_STATUS_ORDER: TAlertUiStatus[] = [
  "live",
  "scheduled",
  "done",
  "canceled",
];

export const ALERT_STATUS_DOT_CLASS: Record<TAlertUiStatus, string> = {
  live: "bg-(--statusR200) shadow-[0_0_10px_var(--statusR200)]",
  scheduled: "bg-(--Primary300) shadow-[0_0_10px_var(--Primary300)]",
  done: "bg-(--statusG200) shadow-[0_0_10px_var(--statusG200)]",
  canceled: "bg-(--Grey500)",
};

export const ALERT_STATUS_ACCENT_CLASS: Record<TAlertUiStatus, string> = {
  live: "before:bg-(--statusR200)",
  scheduled: "before:bg-(--Primary300)",
  done: "before:bg-(--statusG200)",
  canceled: "before:bg-(--Grey500)",
};

export const ALERT_STATUS_BADGE_CLASS: Record<TAlertUiStatus, string> = {
  live: "border-(--statusR200)/40 text-(--statusR200)",
  scheduled: "border-(--Primary300)/40 text-(--Primary300)",
  done: "border-(--statusG200)/40 text-(--statusG200)",
  canceled: "border-(--Grey400) text-(--Grey600)",
};
