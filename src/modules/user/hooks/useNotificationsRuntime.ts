import { useEffect } from "react";
import { toast } from "react-toastify";
import i18n from "@/i18n/config";
import { queryClient } from "@/lib/queryClient";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import {
  subscribeToNotifications,
  type TReceiveNotificationPayload,
} from "@/services/hub";
import { userNotificationsQueryRootKey } from "../api/hooks/notificationsQueryKey";
import { refreshPermissions } from "../api/hooks/permissionsQueryKey";
import { parseNotificationJson } from "../utils/parseNotificationJson";

const COMPANY_MEMBERSHIP_TYPE = "CompanyMembershipPayload";

const resolveToastText = (notification: TReceiveNotificationPayload) => {
  const title = notification.title?.trim() || null;
  const message = notification.message?.trim() || null;

  if (title && message) {
    return `${title}\n${message}`;
  }

  if (title) {
    return title;
  }

  if (message) {
    return message;
  }

  return i18n.t("user.notifications.generic");
};

const handleLiveNotification = (notification: TReceiveNotificationPayload) => {
  parseNotificationJson(notification.data);
  parseNotificationJson(notification.navigations);

  toast.info(resolveToastText(notification));

  void queryClient.invalidateQueries({
    queryKey: userNotificationsQueryRootKey,
  });

  if (notification.type === COMPANY_MEMBERSHIP_TYPE) {
    void refreshPermissions();
    void queryClient.invalidateQueries({
      queryKey: availableCompaniesQueryKey,
    });
  }
};

export const useNotificationsRuntime = () => {
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(handleLiveNotification);
    return unsubscribe;
  }, []);
};
