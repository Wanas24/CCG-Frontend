import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type {
  TForgotPasswordPayload,
  TForgotPasswordResponse,
} from "../../types";

type ForgotPasswordApiError = { message: string };

export const useForgotPassword = () => {
  return useMutation<
    TForgotPasswordResponse,
    AxiosError<ForgotPasswordApiError>,
    TForgotPasswordPayload
  >({
    mutationFn: authService.forgotPassword,
  });
};
