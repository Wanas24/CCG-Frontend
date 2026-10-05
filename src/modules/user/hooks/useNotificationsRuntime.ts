import { createElement, useEffect } from "react";
import { toast } from "react-toastify";
import { queryClient } from "@/lib/queryClient";
import { availableCompaniesQueryKey } from "@/modules/authentication/api/hooks/availableCompaniesQueryKey";
import { approvalQueryRootKey } from "@/modules/approval/api/queryKeys/approvalWorkflowQueryKeys";
import {
  subscribeToNotifications,
  type TReceiveNotificationPayload,
} from "@/services/hub";
import NotificationToastBody from "../components/Notifications/NotificationToastBody";
import { userNotificationsQueryRootKey } from "../api/hooks/notificationsQueryKey";
import { refreshPermissions } from "../api/hooks/permissionsQueryKey";
import { parseNotificationJson } from "../utils/parseNotificationJson";
import { resolveNotificationText } from "../utils/resolveNotificationText";

const COMPANY_MEMBERSHIP_TYPE = "CompanyMembershipPayload";
const PROJECT_TYPE = "Project";

const handleLiveNotification = (notification: TReceiveNotificationPayload) => {
  parseNotificationJson(notification.data);
  parseNotificationJson(notification.navigations);

  const { title, message, fallback, hasContent } =
    resolveNotificationText(notification);

  toast.info(
    createElement(NotificationToastBody, {
      title,
      message,
      fallback,
      hasContent,
    }),
  );

  void queryClient.invalidateQueries({
    queryKey: userNotificationsQueryRootKey,
  });

  if (notification.type === COMPANY_MEMBERSHIP_TYPE) {
    void refreshPermissions();
    void queryClient.invalidateQueries({
      queryKey: availableCompaniesQueryKey,
    });
  }

  if (notification.type === PROJECT_TYPE) {
    void queryClient.invalidateQueries({
      queryKey: approvalQueryRootKey,
    });
  }
};

export const useNotificationsRuntime = () => {
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(handleLiveNotification);
    return unsubscribe;
  }, []);
};
