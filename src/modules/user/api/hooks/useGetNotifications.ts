import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { userService } from "../services/user.service";
import { userNotificationsQueryKey } from "./notificationsQueryKey";
import type {
  TGetNotificationsParams,
  TNotificationListResponse,
} from "../../types";

export const useGetNotifications = (
  params: TGetNotificationsParams,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TNotificationListResponse>({
    queryKey: userNotificationsQueryKey(params),
    queryFn: () => userService.getNotifications(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
