import dayjs, { type Dayjs } from "dayjs";

export const toAiSubscriptionDatePickerValue = (
  value: string | null | undefined,
): Dayjs | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const parsed = dayjs(`${year}-${month}-${day}`);
  return parsed.isValid() ? parsed : null;
};

export const toAiSubscriptionApiUtc = (
  value: Dayjs | null | undefined,
): string | null => {
  if (!value || !value.isValid()) {
    return null;
  }

  return `${value.format("YYYY-MM-DD")}T00:00:00.000Z`;
};

export const formatAiSubscriptionDate = (
  value: string | null | undefined,
  locale: string,
): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};
