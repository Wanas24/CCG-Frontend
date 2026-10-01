export const PermissionsList = {
  Ai:{
    AiAssistantChat: "AiAssistant.Chat",
    AiAssistantAll: "AiAssistant.All",
    AiSubscriptionGet: "AiSubscription.Get",
    AiSubscriptionUpdate: "AiSubscription.Update",
  },
  Company: {
    GetCompanyInfo: "Company.GetCompanyInfo",
    GetLogo: "Company.GetLogo",
    Edit: "Company.Edit",
    UploadLogo: "Company.UploadLogo",
    DeleteLogo: "Company.DeleteLogo",
  },
} as const;

type DeepStringValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? DeepStringValues<T[keyof T]>
    : never;

export type AppPermission = DeepStringValues<typeof PermissionsList>;
