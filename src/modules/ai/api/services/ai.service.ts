import { callEndpoint } from "@/lib/api/callEndpoint";
import { aiEndpoints } from "../endPoints/ai.endpoints";
import type {
  TGetAiChatsResponse,
  TGetAiMessagesResponse,
  TGetAiUsageResponse,
  TSendAiChatRequest,
  TSendAiChatResponse,
} from "../../types";

const DEFAULT_MESSAGES_PAGE_SIZE = 10;
const MAX_MESSAGES_PAGE_SIZE = 100;

const buildAiChatFormData = ({
  message,
  audio,
  attachments,
  chatId,
}: TSendAiChatRequest): FormData => {
  const body = new FormData();

  if (message !== undefined && message !== "") {
    body.append("Message", message);
  }

  if (audio) {
    body.append("Audio", audio);
  }

  attachments?.forEach((file) => {
    body.append("Attachments", file);
  });

  if (chatId) {
    body.append("ChatId", chatId);
  }

  return body;
};

export const aiService = {
  getAiChats: () => callEndpoint<TGetAiChatsResponse>(aiEndpoints.chats),

  getAiMessages: (
    chatId: string,
    params?: { page?: number; pageSize?: number },
  ) => {
    const page = params?.page ?? 1;
    const pageSize = Math.min(
      params?.pageSize ?? DEFAULT_MESSAGES_PAGE_SIZE,
      MAX_MESSAGES_PAGE_SIZE,
    );

    return callEndpoint<TGetAiMessagesResponse>(aiEndpoints.messages, {
      pathParams: { chatId },
      queryParams: { page, pageSize },
    });
  },

  sendAiChat: (request: TSendAiChatRequest, signal?: AbortSignal) =>
    callEndpoint<TSendAiChatResponse, FormData>(aiEndpoints.chat, {
      body: buildAiChatFormData(request),
      signal,
    }),

  getAiUsage: () => callEndpoint<TGetAiUsageResponse>(aiEndpoints.usage),
};
