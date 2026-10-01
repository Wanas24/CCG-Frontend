import { callEndpoint } from "@/lib/api/callEndpoint";
import { userEndpoints } from "../endPoints/user.endpoints";
import type {
  TChangePhoneRequest,
  TChangePhoneResponse,
  TDeleteProfileImageResponse,
  TEditProfileRequest,
  TEditProfileResponse,
  TGetCurrentUserPermissionsResponse,
  TGetMeResponse,
  TGetNotificationsParams,
  TMarkAllNotificationsReadResponse,
  TMarkNotificationReadResponse,
  TMarkNotificationUnreadResponse,
  TNotificationListResponse,
  TUpdateLanguageRequest,
  TUpdateLanguageResponse,
  TUpdateThemeRequest,
  TUpdateThemeResponse,
  TUploadProfileImageResponse,
} from "../../types";

const DEFAULT_NOTIFICATIONS_PAGE = 1;

const toNotificationsQueryParams = (params: TGetNotificationsParams) => {
  const page = params.page ?? DEFAULT_NOTIFICATIONS_PAGE;

  return {
    page,
    pageSize: params.pageSize,
    ...(params.isRead !== undefined ? { isRead: params.isRead } : {}),
  };
};

export const userService = {
  getMe: () => callEndpoint<TGetMeResponse>(userEndpoints.getMe),
  editProfile: (body: TEditProfileRequest) =>
    callEndpoint<TEditProfileResponse, TEditProfileRequest>(
      userEndpoints.editProfile,
      { body },
    ),
  changePhone: (body: TChangePhoneRequest) =>
    callEndpoint<TChangePhoneResponse, TChangePhoneRequest>(
      userEndpoints.changePhone,
      { body },
    ),
  uploadProfileImage: (file: File) => {
    const body = new FormData();
    body.append("file", file);

    return callEndpoint<TUploadProfileImageResponse, FormData>(
      userEndpoints.uploadProfileImage,
      { body },
    );
  },
  deleteProfileImage: () =>
    callEndpoint<TDeleteProfileImageResponse>(userEndpoints.deleteProfileImage),
  updateLanguage: (body: TUpdateLanguageRequest) =>
    callEndpoint<TUpdateLanguageResponse, TUpdateLanguageRequest>(
      userEndpoints.updateLanguage,
      { body },
    ),
  updateTheme: (body: TUpdateThemeRequest) =>
    callEndpoint<TUpdateThemeResponse, TUpdateThemeRequest>(
      userEndpoints.updateTheme,
      { body },
    ),
  getCurrentUserPermissions: () =>
    callEndpoint<TGetCurrentUserPermissionsResponse>(
      userEndpoints.getCurrentUserPermissions,
    ),
  getNotifications: (params: TGetNotificationsParams) =>
    callEndpoint<TNotificationListResponse>(userEndpoints.getNotifications, {
      queryParams: toNotificationsQueryParams(params),
    }),
  markNotificationRead: (notificationId: string) =>
    callEndpoint<TMarkNotificationReadResponse>(
      userEndpoints.markNotificationRead,
      { pathParams: { notificationId } },
    ),
  markNotificationUnread: (notificationId: string) =>
    callEndpoint<TMarkNotificationUnreadResponse>(
      userEndpoints.markNotificationUnread,
      { pathParams: { notificationId } },
    ),
  markAllNotificationsRead: () =>
    callEndpoint<TMarkAllNotificationsReadResponse>(
      userEndpoints.markAllNotificationsRead,
    ),
};
