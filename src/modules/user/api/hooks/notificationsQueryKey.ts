import type { TGetNotificationsParams } from "../../types";

export const userNotificationsQueryRootKey = ["user", "notifications"] as const;

export const userNotificationsQueryKey = (params: TGetNotificationsParams) =>
  [...userNotificationsQueryRootKey, params] as const;
