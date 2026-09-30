import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TRegisterPayload, TRegisterResponse } from "../../types";

type RegisterApiError = { message: string };

export const useRegister = () => {
  return useMutation<
    TRegisterResponse,
    AxiosError<RegisterApiError>,
    TRegisterPayload
  >({
    mutationFn: authService.register,
  });
};
