import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const aiEndpoints = {
  chat: createEndpoint({
    method: "POST",
    path: `/ai/chat`,
    auth: "required",
    permissions: [PermissionsList.Ai.AiAssistantChat],
  }),
  chats: createEndpoint({
    method: "GET",
    path: `/ai/chats`,
    auth: "required",
    permissions: [],
  }),
  messages: createEndpoint({
    method: "GET",
    path: `/ai/chats/:chatId/messages`,
    auth: "required",
    permissions: [],
  }),
  usage: createEndpoint({
    method: "GET",
    path: `/ai/usage`,
    auth: "required",
    permissions: [],
  }),
};
