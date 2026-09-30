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
};
