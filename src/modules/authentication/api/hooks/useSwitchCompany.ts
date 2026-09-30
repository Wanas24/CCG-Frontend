import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { authService } from "../services/authentication.service";
import type {
  TSwitchCompanyRequest,
  TSwitchCompanyResponse,
} from "../../types";

type ApiError = { message: string };

export const useSwitchCompany = () => {
  return useMutation<
    TSwitchCompanyResponse,
    AxiosError<ApiError>,
    TSwitchCompanyRequest
  >({
    mutationFn: authService.switchCompany,
  });
};
