import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { aiSubscriptionService } from "../services/aiSubscription.service";
import type {
  TAiSubscriptionUpdateRequest,
  TUpdateAiSubscriptionResponse,
} from "../../types";

type ApiError = { message: string };

type TUpdateAiSubscriptionVariables = {
  userId: string;
  body: TAiSubscriptionUpdateRequest;
};

export const useUpdateAiSubscription = () => {
  return useMutation<
    TUpdateAiSubscriptionResponse,
    AxiosError<ApiError>,
    TUpdateAiSubscriptionVariables
  >({
    mutationFn: ({ userId, body }) =>
      aiSubscriptionService.updateAiSubscription(userId, body),
  });
};
