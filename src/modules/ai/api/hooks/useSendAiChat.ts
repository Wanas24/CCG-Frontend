import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { aiService } from "../services/ai.service";
import type { TSendAiChatRequest, TSendAiChatResponse } from "../../types";

type ApiError = { message: string };

type TSendAiChatVariables = TSendAiChatRequest & {
  signal?: AbortSignal;
};

export const useSendAiChat = () => {
  return useMutation<
    TSendAiChatResponse,
    AxiosError<ApiError>,
    TSendAiChatVariables
  >({
    mutationFn: ({ signal, ...request }) =>
      aiService.sendAiChat(request, signal),
  });
};
