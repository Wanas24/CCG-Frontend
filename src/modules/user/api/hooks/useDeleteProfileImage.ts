import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import type { TDeleteProfileImageResponse } from "../../types";

type ApiError = { message: string };

export const useDeleteProfileImage = () => {
  return useMutation<TDeleteProfileImageResponse, AxiosError<ApiError>, void>({
    mutationFn: userService.deleteProfileImage,
  });
};
