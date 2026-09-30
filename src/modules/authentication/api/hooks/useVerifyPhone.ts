import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TSimpleResult } from "../../types";

type ApiError = { message: string };

export const useVerifyPhone = () => {
  return useMutation<TSimpleResult, AxiosError<ApiError>, void>({
    mutationFn: authService.verifyPhone,
  });
};
