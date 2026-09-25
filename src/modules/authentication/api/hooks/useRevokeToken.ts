import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TRevokeTokenPayload } from "../../types";

type RevokeApiError = { message: string };

export const useRevokeToken = () => {
  return useMutation<void, AxiosError<RevokeApiError>, TRevokeTokenPayload>({
    mutationFn: authService.revokeToken,
  });
};
