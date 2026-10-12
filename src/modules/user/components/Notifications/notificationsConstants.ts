import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";

export const NOTIFICATIONS_PAGE_SIZE = DEFAULT_PAGE_SIZE;

export type NotificationFilter = "all" | "unread" | "read";

export const buildNotificationListParams = (filter: NotificationFilter) => {
  if (filter === "unread") {
    return {
      page: 1,
      pageSize: NOTIFICATIONS_PAGE_SIZE,
      isRead: false,
    } as const;
  }

  if (filter === "read") {
    return {
      page: 1,
      pageSize: NOTIFICATIONS_PAGE_SIZE,
      isRead: true,
    } as const;
  }

  return {
    page: 1,
    pageSize: NOTIFICATIONS_PAGE_SIZE,
  } as const;
};

export const notificationUnreadCountParams = {
  page: 1,
  pageSize: NOTIFICATIONS_PAGE_SIZE,
  isRead: false,
} as const;
