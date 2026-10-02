import type { TSimpleResult } from "@/modules/authentication/types";

export type TNotification = {
  id: string;
  title: string | null;
  message: string | null;
  type: string;
  data: string | null;
  navigations: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
};

export type TNotificationListData = {
  data: TNotification[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type TNotificationListResponse = TSimpleResult<TNotificationListData>;

export type TGetNotificationsParams = {
  page?: number;
  pageSize: number;
  isRead?: boolean;
};

export type TMarkNotificationReadResponse = TSimpleResult<boolean>;

export type TMarkNotificationUnreadResponse = TSimpleResult<boolean>;

export type TMarkAllNotificationsReadResponse = TSimpleResult<number>;
