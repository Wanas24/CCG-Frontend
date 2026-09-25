import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TRefreshTokenResponse } from "../../types";

type RefreshApiError = { message: string };

export const useRefreshToken = () => {
  return useMutation<TRefreshTokenResponse, AxiosError<RefreshApiError>, void>({
    mutationFn: authService.refreshToken,
  });
};
