import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TLoginPayload, TLoginResponse } from "../../types";

type LoginApiError = { message: string };

export const useLogin = () => {
  return useMutation<TLoginResponse, AxiosError<LoginApiError>, TLoginPayload>({
    mutationFn: authService.login,
  });
};
