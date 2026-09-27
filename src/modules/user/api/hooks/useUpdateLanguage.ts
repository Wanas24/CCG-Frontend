import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type {
  TUpdateLanguageRequest,
  TUpdateLanguageResponse,
} from "../../types";

type ApiError = { message: string };

export const useUpdateLanguage = () => {
  return useMutation<
    TUpdateLanguageResponse,
    AxiosError<ApiError>,
    TUpdateLanguageRequest
  >({
    mutationFn: userService.updateLanguage,
  });
};
