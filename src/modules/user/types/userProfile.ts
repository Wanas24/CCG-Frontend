import type { TSimpleResult } from "@/modules/authentication/types";

export type TUserProfile = {
  id: string;
  email: string;
  userName: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  fullAddress: string;
  extraPhone: string;
  nationalId: string;
  dateOfBirth: string;
  profileImage: string | null;
  userTypeName: string;
  companyId: string | null;
  isManager: boolean;
  isActive: boolean;
  language: string;
  theme: string;
};

export type TGetUserResponse = TSimpleResult<TUserProfile>;
