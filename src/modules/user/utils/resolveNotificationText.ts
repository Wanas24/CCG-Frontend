import i18n from "@/i18n/config";

type NotificationTextSource = {
  title: string | null;
  message: string | null;
};

export const resolveNotificationText = (
  notification: NotificationTextSource,
) => {
  const title = notification.title?.trim() || null;
  const message = notification.message?.trim() || null;

  return {
    title,
    message,
    fallback: i18n.t("user.notifications.generic"),
    hasContent: Boolean(title || message),
  };
};
