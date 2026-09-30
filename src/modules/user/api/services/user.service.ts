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
  TUpdateLanguageRequest,
  TUpdateLanguageResponse,
  TUpdateThemeRequest,
  TUpdateThemeResponse,
  TUploadProfileImageResponse,
} from "../../types";

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
};
