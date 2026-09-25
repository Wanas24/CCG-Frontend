import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type { TConfirmationStatusResponse } from "../../types";

type ApiError = { message: string };

export const useConfirmationStatus = () => {
  return useMutation<TConfirmationStatusResponse, AxiosError<ApiError>, void>({
    mutationFn: authService.getConfirmationStatus,
  });
};
