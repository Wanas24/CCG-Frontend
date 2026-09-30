import type { TSimpleResult } from "./simpleResult";

export type TResetPasswordParams = {
  email: string;
  token: string;
};

export type TResetPasswordPayload = {
  email: string;
  token: string;
  newPassword: string;
};

export type TResetPasswordResponse = TSimpleResult;
