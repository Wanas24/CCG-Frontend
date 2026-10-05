import { useEffect, useMemo, useState } from "react";
import { Badge, Dropdown } from "antd";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { navbarIconActionClassName } from "@/shared/components/AppNavbar/navbarIconActionClassName";
import { useGetNotifications } from "../../api/hooks/useGetNotifications";
import { useMarkAllNotificationsRead } from "../../api/hooks/useMarkAllNotificationsRead";
import { useMarkNotificationRead } from "../../api/hooks/useMarkNotificationRead";
import { useMarkNotificationUnread } from "../../api/hooks/useMarkNotificationUnread";
import {
  buildNotificationListParams,
  notificationUnreadCountParams,
  type NotificationFilter,
} from "./notificationsConstants";
import NotificationsPanel from "./NotificationsPanel";

type Props = {
  showLabel?: boolean;
};

const NotificationsBell = ({ showLabel = false }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const label = t("user.notifications.title");

  const listParams = useMemo(
    () => buildNotificationListParams(filter),
    [filter],
  );

  const unreadQuery = useGetNotifications(notificationUnreadCountParams);
  const {
    data: listData,
    isPending: isListPending,
    isError: isListError,
    isFetching: isListFetching,
    refetch: refetchList,
  } = useGetNotifications(listParams, open);

  const markReadMutation = useMarkNotificationRead();
  const markUnreadMutation = useMarkNotificationUnread();
  const markAllMutation = useMarkAllNotificationsRead();

  useEffect(() => {
    if (!open) {
      return;
    }

    void refetchList();
  }, [open, filter, refetchList]);

  const unreadCount =
    unreadQuery.data?.isSuccess && unreadQuery.data.data
      ? unreadQuery.data.data.totalCount
      : 0;

  const notifications =
    listData?.isSuccess && listData.data ? listData.data.data : [];

  const pendingNotificationId =
    markReadMutation.isPending && markReadMutation.variables
      ? markReadMutation.variables
      : markUnreadMutation.isPending && markUnreadMutation.variables
        ? markUnreadMutation.variables
        : null;

  const areActionsDisabled =
    Boolean(pendingNotificationId) || markAllMutation.isPending;

  const trigger = (
    <AppButton
      variant="default"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      iconPlacement="start"
      className={clsx(
        showLabel
          ? "w-full !justify-start hover:bg-(--Grey100)!"
          : navbarIconActionClassName,
      )}
      icon={<Bell size={18} />}
    >
      {showLabel ? label : null}
    </AppButton>
  );

  return (
    <Dropdown
      trigger={["click"]}
      open={open}
      destroyOnHidden
      onOpenChange={setOpen}
      popupRender={() => (
        <NotificationsPanel
          notifications={notifications}
          filter={filter}
          isLoading={isListPending && !listData}
          isError={isListError || Boolean(listData && !listData.isSuccess)}
          isFetching={isListFetching}
          isMarkingAll={markAllMutation.isPending}
          pendingNotificationId={pendingNotificationId}
          areActionsDisabled={areActionsDisabled}
          canMarkAll={unreadCount > 0}
          onFilterChange={setFilter}
          onRetry={() => {
            void refetchList();
          }}
          onMarkRead={(notificationId) => {
            markReadMutation.mutate(notificationId);
          }}
          onMarkUnread={(notificationId) => {
            markUnreadMutation.mutate(notificationId);
          }}
          onMarkAllRead={() => {
            markAllMutation.mutate();
          }}
        />
      )}
    >
      <span className={showLabel ? "block w-full" : "inline-flex"}>
        <Badge count={unreadCount} overflowCount={99} size="small">
          {trigger}
        </Badge>
      </span>
    </Dropdown>
  );
};

export default NotificationsBell;
