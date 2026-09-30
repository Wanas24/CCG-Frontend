import type { TSimpleResult } from "@/modules/authentication/types";
import type { TUserInfo } from "./userInfo";

export type TEditProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  extraPhone: string;
  nationalId: string;
  dateOfBirth: string;
  fullAddress: string;
  language: string;
  theme: string;
};

export type TGetMeResponse = TSimpleResult<TUserInfo>;

export type TEditProfileResponse = TSimpleResult<string>;
