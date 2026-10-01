import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { aiService } from "../services/ai.service";
import type { TArchiveAiChatResponse } from "../../types";

type ApiError = { message: string };

export const useArchiveAiChat = () => {
  return useMutation<TArchiveAiChatResponse, AxiosError<ApiError>, string>({
    mutationFn: aiService.archiveAiChat,
  });
};
