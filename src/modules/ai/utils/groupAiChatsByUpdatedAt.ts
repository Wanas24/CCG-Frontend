import dayjs from "dayjs";
import type { TAiChatSummary } from "../types";

export type TAiChatGroupKey = "today" | "yesterday" | "older";

export type TAiChatGroup = {
  key: TAiChatGroupKey;
  chats: TAiChatSummary[];
};

const getGroupKey = (updatedAtUtc: string): TAiChatGroupKey => {
  const updatedLocal = dayjs(updatedAtUtc);
  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");

  if (updatedLocal.isSame(today, "day")) {
    return "today";
  }

  if (updatedLocal.isSame(yesterday, "day")) {
    return "yesterday";
  }

  return "older";
};

export const groupAiChatsByUpdatedAt = (
  chats: TAiChatSummary[],
): TAiChatGroup[] => {
  const sorted = [...chats].sort(
    (a, b) => dayjs(b.updatedAtUtc).valueOf() - dayjs(a.updatedAtUtc).valueOf(),
  );

  const buckets: Record<TAiChatGroupKey, TAiChatSummary[]> = {
    today: [],
    yesterday: [],
    older: [],
  };

  for (const chat of sorted) {
    buckets[getGroupKey(chat.updatedAtUtc)].push(chat);
  }

  return (["today", "yesterday", "older"] as const)
    .filter((key) => buckets[key].length > 0)
    .map((key) => ({ key, chats: buckets[key] }));
};
