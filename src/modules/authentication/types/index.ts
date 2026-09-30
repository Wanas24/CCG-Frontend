export type {
  TSimpleResult,
  TSimpleResultErrorCode,
} from "./simpleResult";

export type { TUser } from "./user";

export type { TAuthPayload } from "./authPayload";

export type { TLoginPayload, TLoginResponse } from "./login";

export type { TRegisterPayload, TRegisterResponse } from "./register";

export type { TRefreshTokenResponse } from "./refreshToken";

export type { TRevokeTokenPayload } from "./revokeToken";

export type {
  TForgotPasswordPayload,
  TForgotPasswordResponse,
} from "./forgotPassword";

export type {
  TResetPasswordParams,
  TResetPasswordPayload,
  TResetPasswordResponse,
} from "./resetPassword";

export type {
  TConfirmationStatus,
  TConfirmationStatusResponse,
  TSendEmailConfirmationPayload,
  TConfirmEmailParams,
} from "./verification";

export { isAccountVerified } from "./verification";
