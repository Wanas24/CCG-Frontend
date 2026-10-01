import { createEndpoint } from "@/lib/api/createEndpoint";

export const userEndpoints = {
  getMe: createEndpoint({
    method: "GET",
    path: `/User`,
    auth: "required",
  }),
  editProfile: createEndpoint({
    method: "PUT",
    path: `/User`,
    auth: "required",
  }),
  changePhone: createEndpoint({
    method: "PUT",
    path: `/User/phone`,
    auth: "required",
  }),
  uploadProfileImage: createEndpoint({
    method: "POST",
    path: `/User/profile-image`,
    auth: "required",
  }),
  deleteProfileImage: createEndpoint({
    method: "DELETE",
    path: `/User/profile-image`,
    auth: "required",
  }),
  updateLanguage: createEndpoint({
    method: "PUT",
    path: `/User/language`,
    auth: "required",
  }),
  updateTheme: createEndpoint({
    method: "PUT",
    path: `/User/theme`,
    auth: "required",
  }),
  getCurrentUserPermissions: createEndpoint({
    method: "GET",
    path: `/User/permissions`,
    auth: "required",
    permissions: [],
  }),
  getNotifications: createEndpoint({
    method: "GET",
    path: `/User/notifications`,
    auth: "required",
  }),
  markNotificationRead: createEndpoint({
    method: "POST",
    path: `/User/notifications/:notificationId/read`,
    auth: "required",
  }),
  markNotificationUnread: createEndpoint({
    method: "POST",
    path: `/User/notifications/:notificationId/unread`,
    auth: "required",
  }),
  markAllNotificationsRead: createEndpoint({
    method: "POST",
    path: `/User/notifications/read-all`,
    auth: "required",
  }),
};
