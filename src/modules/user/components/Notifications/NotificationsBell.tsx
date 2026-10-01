import { useEffect, useState } from "react";
import { Badge, Dropdown } from "antd";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useGetNotifications } from "../../api/hooks/useGetNotifications";
import { NOTIFICATIONS_PAGE_SIZE } from "./notificationsConstants";
import NotificationsPanel from "./NotificationsPanel";

type Props = {
  showLabel?: boolean;
};

const unreadParams = {
  page: 1,
  pageSize: NOTIFICATIONS_PAGE_SIZE,
  isRead: false,
} as const;

const latestParams = {
  page: 1,
  pageSize: NOTIFICATIONS_PAGE_SIZE,
} as const;

const NotificationsBell = ({ showLabel = false }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const label = t("user.notifications.title");

  const unreadQuery = useGetNotifications(unreadParams);
  const {
    data: latestData,
    isPending: isLatestPending,
    isError: isLatestError,
    isFetching: isLatestFetching,
    refetch: refetchLatest,
  } = useGetNotifications(latestParams, open);

  useEffect(() => {
    if (!open) {
      return;
    }

    void refetchLatest();
  }, [open, refetchLatest]);

  const unreadCount =
    unreadQuery.data?.isSuccess && unreadQuery.data.data
      ? unreadQuery.data.data.totalCount
      : 0;

  const notifications =
    latestData?.isSuccess && latestData.data ? latestData.data.data : [];

  const trigger = (
    <AppButton
      variant="default"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      iconPlacement="start"
      className={
        showLabel
          ? "w-full !justify-start hover:bg-(--Grey100)!"
          : undefined
      }
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
          isLoading={isLatestPending && !latestData}
          isError={
            isLatestError || Boolean(latestData && !latestData.isSuccess)
          }
          isFetching={isLatestFetching}
          onRetry={() => {
            void refetchLatest();
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
