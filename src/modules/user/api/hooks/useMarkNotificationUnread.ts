import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import { userNotificationsQueryRootKey } from "./notificationsQueryKey";
import type { TMarkNotificationUnreadResponse } from "../../types";

type ApiError = { message: string };

export const useMarkNotificationUnread = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TMarkNotificationUnreadResponse,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: userService.markNotificationUnread,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userNotificationsQueryRootKey,
      });
    },
  });
};
