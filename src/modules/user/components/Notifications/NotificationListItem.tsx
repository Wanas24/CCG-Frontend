import { useState } from "react";
import clsx from "clsx";
import { Check, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useLocale } from "@/i18n/useLocale";
import type { TNotification } from "../../types";
import { formatNotificationDate } from "../../utils/formatNotificationDate";
import { getNotificationDataEntries } from "../../utils/getNotificationDataEntries";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, message, fallback, hasContent } =
    resolveNotificationText(notification);
  const dataEntries = getNotificationDataEntries(notification.data);
  const hasExpandableData = Boolean(dataEntries);
  const createdLabel = formatNotificationDate(notification.createdAt, locale);
  const markAsReadLabel = t("user.notifications.markAsRead");
  const markAsUnreadLabel = t("user.notifications.markAsUnread");
  const expandLabel = t("user.notifications.expandDetails");
  const collapseLabel = t("user.notifications.collapseDetails");

  const onToggleExpand = () => {
    const nextExpanded = !isExpanded;
    setIsExpanded(nextExpanded);

    if (nextExpanded && !notification.isRead) {
      onMarkRead(notification.id);
    }
  };

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
                  "m-0 whitespace-pre-wrap text-(--app-text)",
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

        {hasExpandableData && dataEntries && isExpanded ? (
          <dl className="m-0 mt-1 flex flex-col gap-1 border-t border-(--Grey300) pt-2">
            {dataEntries.map((entry) => (
              <div
                key={entry.key}
                className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-2 gap-y-0.5"
              >
                <dt
                  className={clsx(
                    DesignTokens.inputs.labelFontSize,
                    DesignTokens.typography.muted,
                    "m-0",
                  )}
                >
                  {entry.key}
                </dt>
                <dd
                  className={clsx(
                    DesignTokens.inputs.labelFontSize,
                    "m-0 break-words text-(--app-text)",
                  )}
                >
                  {entry.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        {hasExpandableData ? (
          <Tooltip title={isExpanded ? collapseLabel : expandLabel}>
            <AppButton
              variant="default"
              icon={
                isExpanded ? (
                  <ChevronUp size={DesignTokens.media.iconSm} />
                ) : (
                  <ChevronDown size={DesignTokens.media.iconSm} />
                )
              }
              aria-label={isExpanded ? collapseLabel : expandLabel}
              aria-expanded={isExpanded}
              onClick={onToggleExpand}
            />
          </Tooltip>
        ) : null}

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
