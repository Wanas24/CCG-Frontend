import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TConfirmEmailParams, TSimpleResult } from "../../types";

type ApiError = { message: string };

export const useConfirmEmail = () => {
  return useMutation<TSimpleResult, AxiosError<ApiError>, TConfirmEmailParams>({
    mutationFn: authService.confirmEmail,
  });
};
