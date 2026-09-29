import type { TGetAiSubscriptionsParams } from "../../types";

export const aiChatsQueryKey = ["ai", "chats"] as const;

export const aiMessagesQueryKey = (chatId: string) =>
  ["ai", "messages", chatId] as const;

export const aiUsageQueryKey = ["ai", "usage"] as const;

export const aiSubscriptionsQueryKey = (
  params: TGetAiSubscriptionsParams = {},
) => ["ai", "subscriptions", params] as const;

export const aiSubscriptionQueryKey = (userId: string) =>
  ["ai", "subscription", userId] as const;
