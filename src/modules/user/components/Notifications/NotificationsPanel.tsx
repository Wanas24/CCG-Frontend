import clsx from "clsx";
import { Segmented } from "antd";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import type { TNotification } from "../../types";
import type { NotificationFilter } from "./notificationsConstants";
import NotificationListItem from "./NotificationListItem";

type Props = {
  notifications: TNotification[];
  filter: NotificationFilter;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isMarkingAll: boolean;
  pendingNotificationId: string | null;
  areActionsDisabled: boolean;
  canMarkAll: boolean;
  onFilterChange: (filter: NotificationFilter) => void;
  onRetry: () => void;
  onMarkRead: (notificationId: string) => void;
  onMarkUnread: (notificationId: string) => void;
  onMarkAllRead: () => void;
};

const NotificationsPanel = ({
  notifications,
  filter,
  isLoading,
  isError,
  isFetching,
  isMarkingAll,
  pendingNotificationId,
  areActionsDisabled,
  canMarkAll,
  onFilterChange,
  onRetry,
  onMarkRead,
  onMarkUnread,
  onMarkAllRead,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      role="dialog"
      aria-label={t("user.notifications.title")}
      className={clsx(
        "flex max-h-96 w-80 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl border border-(--Grey300) bg-(--app-surface) shadow",
      )}
    >
      <div className="flex flex-col gap-2 border-b border-(--Grey300) px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className={clsx(DesignTokens.typography.headingSm, "m-0")}>
            {t("user.notifications.title")}
          </h2>
          <AppButton
            variant="secondary"
            loading={isMarkingAll}
            disabled={!canMarkAll || areActionsDisabled}
            onClick={onMarkAllRead}
            aria-label={t("user.notifications.markAllAsRead")}
            className="shrink-0!"
          >
            {t("user.notifications.markAllAsRead")}
          </AppButton>
        </div>

        <Segmented<NotificationFilter>
          block
          value={filter}
          aria-label={t("user.notifications.filtersLabel")}
          options={[
            { label: t("user.notifications.filters.all"), value: "all" },
            {
              label: t("user.notifications.filters.unread"),
              value: "unread",
            },
            { label: t("user.notifications.filters.read"), value: "read" },
          ]}
          onChange={onFilterChange}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex flex-col divide-y divide-(--Grey300)" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-start gap-2 px-3 py-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <AppSkeleton.Input
                    active
                    className="!h-4 !w-40 !min-w-28"
                  />
                  <AppSkeleton.Input
                    active
                    block
                    className="!h-3 !w-full !min-w-0"
                  />
                  <AppSkeleton.Input
                    active
                    className="!h-3 !w-24 !min-w-20"
                  />
                </div>
                <AppSkeleton.Button
                  active
                  size="small"
                  className="!size-7 !min-w-7"
                />
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <div className="flex flex-col items-start gap-3 p-3">
            <p
              className={clsx(
                DesignTokens.inputs.labelFontSize,
                DesignTokens.typography.muted,
                "m-0",
              )}
            >
              {t("user.notifications.loadError")}
            </p>
            <AppButton
              variant="secondary"
              loading={isFetching}
              onClick={onRetry}
              className="w-fit!"
            >
              {t("user.notifications.retry")}
            </AppButton>
          </div>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
          <p
            className={clsx(
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.muted,
              "m-0 px-3 py-6 text-center",
            )}
          >
            {t("user.notifications.empty")}
          </p>
        ) : null}

        {!isLoading && !isError && notifications.length > 0 ? (
          <ul className="m-0 flex list-none flex-col divide-y divide-(--Grey300) p-0">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <NotificationListItem
                  notification={notification}
                  isActionLoading={pendingNotificationId === notification.id}
                  isActionDisabled={areActionsDisabled}
                  onMarkRead={onMarkRead}
                  onMarkUnread={onMarkUnread}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default NotificationsPanel;
