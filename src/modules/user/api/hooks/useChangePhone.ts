import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type { TChangePhoneRequest, TChangePhoneResponse } from "../../types";

type ApiError = { message: string };

export const useChangePhone = () => {
  return useMutation<
    TChangePhoneResponse,
    AxiosError<ApiError>,
    TChangePhoneRequest
  >({
    mutationFn: userService.changePhone,
  });
};
