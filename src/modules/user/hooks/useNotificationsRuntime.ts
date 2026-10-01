import { useEffect } from "react";
import { toast } from "react-toastify";
import i18n from "@/i18n/config";
import { queryClient } from "@/lib/queryClient";
import {
  subscribeToNotifications,
  type TReceiveNotificationPayload,
} from "@/services/hub";
import { userNotificationsQueryRootKey } from "../api/hooks/notificationsQueryKey";
import { parseNotificationJson } from "../utils/parseNotificationJson";

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
};

export const useNotificationsRuntime = () => {
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(handleLiveNotification);
    return unsubscribe;
  }, []);
};
