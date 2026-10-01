import clsx from "clsx";
import { Check, Mail } from "lucide-react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useLocale } from "@/i18n/useLocale";
import type { TNotification } from "../../types";
import { formatNotificationDate } from "../../utils/formatNotificationDate";
import { resolveNotificationText } from "../../utils/resolveNotificationText";

type Props = {
  notification: TNotification;
  isActionLoading: boolean;
  isActionDisabled: boolean;
  onMarkRead: (notificationId: string) => void;
  onMarkUnread: (notificationId: string) => void;
};

const NotificationListItem = ({
  notification,
  isActionLoading,
  isActionDisabled,
  onMarkRead,
  onMarkUnread,
}: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { title, message, fallback, hasContent } =
    resolveNotificationText(notification);
  const createdLabel = formatNotificationDate(notification.createdAt, locale);
  const markAsReadLabel = t("user.notifications.markAsRead");
  const markAsUnreadLabel = t("user.notifications.markAsUnread");

  return (
    <article
      className={clsx(
        "flex items-start gap-2 rounded-lg px-3 py-2",
        notification.isRead ? "bg-transparent" : "bg-(--Primary100)",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {hasContent ? (
          <>
            {title ? (
              <h3
                className={clsx(
                  DesignTokens.inputs.labelFontSize,
                  DesignTokens.typography.emphasis,
                  "m-0",
                )}
              >
                {title}
              </h3>
            ) : null}
            {message ? (
              <p
                className={clsx(
                  DesignTokens.inputs.labelFontSize,
                  "m-0 text-(--app-text)",
                )}
              >
                {message}
              </p>
            ) : null}
          </>
        ) : (
          <p
            className={clsx(
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.emphasis,
              "m-0",
            )}
          >
            {fallback}
          </p>
        )}

        {createdLabel ? (
          <time
            dateTime={notification.createdAt}
            className={clsx(
              DesignTokens.inputs.labelFontSize,
              DesignTokens.typography.muted,
            )}
          >
            {createdLabel}
          </time>
        ) : (
          <span className="sr-only">{t("user.notifications.unknownDate")}</span>
        )}
      </div>

      <div className="shrink-0">
        {notification.isRead ? (
          <Tooltip title={markAsUnreadLabel}>
            <AppButton
              variant="default"
              icon={<Mail size={DesignTokens.media.iconSm} />}
              aria-label={markAsUnreadLabel}
              loading={isActionLoading}
              disabled={isActionDisabled}
              onClick={() => onMarkUnread(notification.id)}
            />
          </Tooltip>
        ) : (
          <Tooltip title={markAsReadLabel}>
            <AppButton
              variant="default"
              icon={<Check size={DesignTokens.media.iconSm} />}
              aria-label={markAsReadLabel}
              loading={isActionLoading}
              disabled={isActionDisabled}
              onClick={() => onMarkRead(notification.id)}
            />
          </Tooltip>
        )}
      </div>
    </article>
  );
};

export default NotificationListItem;
