import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { TGetUserResponse } from "../../types";
import { userService } from "../services/user.service";
import { userKeys } from "../user.keys";

type ApiError = { message: string };

export const useGetUser = () => {
  return useQuery<TGetUserResponse, AxiosError<ApiError>>({
    queryKey: userKeys.profile(),
    queryFn: userService.getUser,
  });
};
  