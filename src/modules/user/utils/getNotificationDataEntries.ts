import { parseNotificationJson } from "./parseNotificationJson";

export type TNotificationDataEntry = {
  key: string;
  value: string;
};

const formatNotificationDataValue = (value: unknown): string => {
  if (value == null) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const getNotificationDataEntries = (
  data: string | null | undefined,
): TNotificationDataEntry[] | null => {
  const parsed = parseNotificationJson(data);
  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const entries = Object.entries(parsed as Record<string, unknown>)
    .filter(([key]) => key.trim().length > 0)
    .map(([key, value]) => ({
      key,
      value: formatNotificationDataValue(value),
    }));

  return entries.length > 0 ? entries : null;
};
