import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import type { TNotification } from "../../types";
import NotificationListItem from "./NotificationListItem";

type Props = {
  notifications: TNotification[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
};

const NotificationsPanel = ({
  notifications,
  isLoading,
  isError,
  isFetching,
  onRetry,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div
      role="dialog"
      aria-label={t("user.notifications.title")}
      className={clsx(
        "flex max-h-96 flex-col overflow-hidden rounded-xl border border-(--Grey300) bg-(--app-surface) shadow",
        DesignTokens.layout.switcherMenu,
      )}
    >
      <div className="border-b border-(--Grey300) px-3 py-2">
        <h2 className={clsx(DesignTokens.typography.headingSm, "m-0")}>
          {t("user.notifications.title")}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-1">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-2">
            <AppSkeleton active paragraph={{ rows: 2 }} title={false} />
            <AppSkeleton active paragraph={{ rows: 2 }} title={false} />
            <AppSkeleton active paragraph={{ rows: 2 }} title={false} />
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
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <NotificationListItem notification={notification} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default NotificationsPanel;
