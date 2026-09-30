import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type {
  TSendEmailConfirmationPayload,
  TSimpleResult,
} from "../../types";

type ApiError = { message: string };

export const useSendEmailConfirmation = () => {
  return useMutation<
    TSimpleResult,
    AxiosError<ApiError>,
    TSendEmailConfirmationPayload
  >({
    mutationFn: authService.sendEmailConfirmation,
  });
};
