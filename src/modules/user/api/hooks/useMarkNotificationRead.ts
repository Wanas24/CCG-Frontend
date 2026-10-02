import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { userService } from "../services/user.service";
import { userNotificationsQueryRootKey } from "./notificationsQueryKey";
import type { TMarkNotificationReadResponse } from "../../types";

type ApiError = { message: string };

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<
    TMarkNotificationReadResponse,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: userService.markNotificationRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userNotificationsQueryRootKey,
      });
    },
  });
};
