import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type {
  TResetPasswordPayload,
  TResetPasswordResponse,
} from "../../types";

type ResetPasswordApiError = { message: string };

export const useResetPassword = () => {
  return useMutation<
    TResetPasswordResponse,
    AxiosError<ResetPasswordApiError>,
    TResetPasswordPayload
  >({
    mutationFn: authService.resetPassword,
  });
};
