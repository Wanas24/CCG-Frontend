export const PermissionsList = {
  AiAssistantChat: "AiAssistant.Chat",
  AiAssistantAll: "AiAssistant.All",
  AiSubscriptionGet: "AiSubscription.Get",
  AiSubscriptionUpdate: "AiSubscription.Update",
} as const;

export type AppPermission =
  (typeof PermissionsList)[keyof typeof PermissionsList];
