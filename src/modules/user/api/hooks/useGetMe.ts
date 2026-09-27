import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import type { TGetMeResponse } from "../../types";

export const userMeQueryKey = ["user", "me"] as const;

export const useGetMe = () => {
  return useQuery<TGetMeResponse>({
    queryKey: userMeQueryKey,
    queryFn: userService.getMe,
    staleTime: 0,
    refetchOnMount: true,
  });
};
