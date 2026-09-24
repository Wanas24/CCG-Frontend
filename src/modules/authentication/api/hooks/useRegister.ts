import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TRegisterPayload } from "../../types/auth";

type RegisterApiError = { message: string };

export const useRegister = () => {
  return useMutation<void, AxiosError<RegisterApiError>, TRegisterPayload>({
    mutationFn: authService.register,
  });
};
