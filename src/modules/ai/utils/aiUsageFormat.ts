export const clampAiUsageProgress = (
  used: number,
  limit: number,
): number | null => {
  if (
    !Number.isFinite(used) ||
    !Number.isFinite(limit) ||
    limit <= 0 ||
    used < 0
  ) {
    return null;
  }

  return Math.min(100, Math.max(0, (used / limit) * 100));
};

export const formatAiUsageNumber = (value: number, locale: string) => {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en").format(value);
};
