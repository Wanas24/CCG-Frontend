import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import type { TNotification } from "../../types";
import { formatNotificationDate } from "../../utils/formatNotificationDate";
import { resolveNotificationText } from "../../utils/resolveNotificationText";

type Props = {
  notification: TNotification;
};

const NotificationListItem = ({ notification }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { title, message, fallback, hasContent } =
    resolveNotificationText(notification);
  const createdLabel = formatNotificationDate(notification.createdAt, locale);

  return (
    <article
      className={clsx(
        "flex flex-col gap-1 rounded-lg px-3 py-2",
        notification.isRead
          ? "bg-transparent"
          : "bg-(--Primary100)",
      )}
    >
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
    </article>
  );
};

export default NotificationListItem;
