import type { TUser } from "@/modules/authentication/types";
import type { TUserInfo } from "../types";

const isSessionLanguage = (value: string): value is TUser["language"] =>
  value === "en" || value === "ar";

const isSessionTheme = (value: string): value is TUser["theme"] =>
  value === "light" || value === "dark" || value === "system";

const isSessionUserType = (value: string): value is TUser["userType"] =>
  value === "User" || value === "Admin";

export const mapUserInfoToSessionUser = (
  profile: TUserInfo,
  current: TUser,
): TUser => ({
  ...current,
  id: profile.id,
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  userName: profile.userName,
  companyId: profile.companyId,
  isManager: profile.isManager,
  isActive: profile.isActive,
  language: isSessionLanguage(profile.language)
    ? profile.language
    : current.language,
  theme: isSessionTheme(profile.theme) ? profile.theme : current.theme,
  userType: isSessionUserType(profile.userTypeName)
    ? profile.userTypeName
    : current.userType,
});
