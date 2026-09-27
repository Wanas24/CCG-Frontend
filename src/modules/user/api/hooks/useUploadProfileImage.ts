import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type { TUploadProfileImageResponse } from "../../types";

type ApiError = { message: string };

export const useUploadProfileImage = () => {
  return useMutation<TUploadProfileImageResponse, AxiosError<ApiError>, File>({
    mutationFn: userService.uploadProfileImage,
  });
};
