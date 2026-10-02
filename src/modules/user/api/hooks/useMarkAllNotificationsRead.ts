import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import { userNotificationsQueryRootKey } from "./notificationsQueryKey";
import type { TMarkAllNotificationsReadResponse } from "../../types";

type ApiError = { message: string };

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TMarkAllNotificationsReadResponse,
    AxiosError<ApiError>,
    void
  >({
    mutationFn: userService.markAllNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userNotificationsQueryRootKey,
      });
    },
  });
};
