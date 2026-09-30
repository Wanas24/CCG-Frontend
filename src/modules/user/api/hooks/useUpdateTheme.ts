import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type { TUpdateThemeRequest, TUpdateThemeResponse } from "../../types";

type ApiError = { message: string };

export const useUpdateTheme = () => {
  return useMutation<
    TUpdateThemeResponse,
    AxiosError<ApiError>,
    TUpdateThemeRequest
  >({
    mutationFn: userService.updateTheme,
  });
};
