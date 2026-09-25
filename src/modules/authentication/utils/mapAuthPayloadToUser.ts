import type { TAuthPayload, TUser } from "../types";

export const mapAuthPayloadToUser = (data: TAuthPayload): TUser => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  userName: data.userName,
  userType: data.userType,
  companyId: data.companyId,
  isManager: data.isManager,
  isActive: data.isActive,
  language: data.language,
  theme: data.theme,
});
