export const formatAlertDateTime = (
  value: string | null | undefined,
  locale: string,
): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatAlertRelativeTime = (
  value: string | null | undefined,
  labels: {
    justNow: string;
    inMinutes: (count: number) => string;
    minutesAgo: (count: number) => string;
    inHours: (count: number) => string;
    hoursAgo: (count: number) => string;
    inDays: (count: number) => string;
    daysAgo: (count: number) => string;
  },
): string => {
  if (!value) return "";

  const triggerMs = new Date(value).getTime();
  if (Number.isNaN(triggerMs)) return "";

  const diff = triggerMs - Date.now();
  const abs = Math.abs(diff);

  if (abs < 60_000) return labels.justNow;

  const minutes = Math.round(abs / 60_000);
  if (minutes < 60) {
    return diff >= 0
      ? labels.inMinutes(minutes)
      : labels.minutesAgo(minutes);
  }

  const hours = Math.round(abs / 3_600_000);
  if (hours < 36) {
    return diff >= 0 ? labels.inHours(hours) : labels.hoursAgo(hours);
  }

  const days = Math.round(abs / 86_400_000);
  return diff >= 0 ? labels.inDays(days) : labels.daysAgo(days);
};

export const getDefaultAlertTriggerAt = (): string => {
  const soon = new Date(Date.now() + 3_600_000);
  soon.setMinutes(0, 0, 0);
  return new Date(soon.getTime() + 3_600_000).toISOString();
};

export const formatAlertDayKey = (
  value: string | null | undefined,
  locale: string,
): string => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
};
