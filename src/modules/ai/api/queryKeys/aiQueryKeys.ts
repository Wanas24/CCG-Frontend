import type { TGetAiSubscriptionsParams } from "../../types";
import { queryClient } from "@/lib/queryClient";

export const aiQueryRootKey = ["ai"] as const;

export const aiChatsQueryKey = ["ai", "chats"] as const;

export const aiMessagesQueryKey = (chatId: string) =>
  ["ai", "messages", chatId] as const;

export const aiUsageQueryKey = ["ai", "usage"] as const;

export const aiSubscriptionsQueryKey = (
  params: TGetAiSubscriptionsParams = {},
) => ["ai", "subscriptions", params] as const;

export const aiSubscriptionQueryKey = (userId: string) =>
  ["ai", "subscription", userId] as const;

export const clearAiQueries = async () => {
  await queryClient.cancelQueries({ queryKey: aiQueryRootKey });
  queryClient.removeQueries({ queryKey: aiQueryRootKey });
};
