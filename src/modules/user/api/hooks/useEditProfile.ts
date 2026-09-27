import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type { TEditProfileRequest, TEditProfileResponse } from "../../types";

type ApiError = { message: string };

export const useEditProfile = () => {
  return useMutation<
    TEditProfileResponse,
    AxiosError<ApiError>,
    TEditProfileRequest
  >({
    mutationFn: userService.editProfile,
  });
};
