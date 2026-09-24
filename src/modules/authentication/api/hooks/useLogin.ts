import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TLoginPayload } from "../../types/auth";

type LoginApiError = { message: string };

export const useLogin = () => {
  return useMutation<void, AxiosError<LoginApiError>, TLoginPayload>({
    mutationFn: authService.login,
  });
};
