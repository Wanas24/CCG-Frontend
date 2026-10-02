import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import type { AppLocale } from "@/i18n/useLocale";

dayjs.extend(relativeTime);

export const formatNotificationDate = (
  createdAt: string,
  locale: AppLocale,
): string => {
  const parsed = dayjs(createdAt).locale(locale);

  if (!parsed.isValid()) {
    return "";
  }

  return parsed.fromNow();
};
