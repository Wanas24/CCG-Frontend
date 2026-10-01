import type {
  TConfirmEmailParams,
  TConfirmationStatusResponse,
  TForgotPasswordPayload,
  TForgotPasswordResponse,
  TLoginPayload,
  TLoginResponse,
  TRegisterPayload,
  TRegisterResponse,
  TRefreshTokenResponse,
  TResetPasswordPayload,
  TResetPasswordResponse,
  TRevokeTokenPayload,
  TSendEmailConfirmationPayload,
  TSimpleResult,
  TSwitchCompanyRequest,
  TSwitchCompanyResponse,
} from "../../types";
import type { TGetAvailableCompaniesResponse } from "@/modules/company/types";
import { authEndpoints } from "../endPoints/authentication.endpoints";
import { callEndpoint } from "@/lib/api/callEndpoint";
import { getDeviceId } from "@/services/deviceId";

export const authService = {
  login: (body: TLoginPayload) =>
    callEndpoint<TLoginResponse, TLoginPayload>(authEndpoints.login, {
      body,
      headers: { "X-Device-Id": getDeviceId() },
    }),
  register: (body: TRegisterPayload) =>
    callEndpoint<TRegisterResponse, TRegisterPayload>(authEndpoints.register, {
      body,
    }),
  refreshToken: () =>
    callEndpoint<TRefreshTokenResponse>(authEndpoints.refreshToken),
  revokeToken: (body: TRevokeTokenPayload = { token: null }) =>
    callEndpoint<void, TRevokeTokenPayload>(authEndpoints.revokeToken, {
      body,
    }),
  forgotPassword: (body: TForgotPasswordPayload) =>
    callEndpoint<TForgotPasswordResponse, TForgotPasswordPayload>(
      authEndpoints.forgotPassword,
      { body },
    ),
  resetPassword: (body: TResetPasswordPayload) =>
    callEndpoint<TResetPasswordResponse, TResetPasswordPayload>(
      authEndpoints.resetPassword,
      { body },
    ),
  sendEmailConfirmation: (body: TSendEmailConfirmationPayload) =>
    callEndpoint<TSimpleResult, TSendEmailConfirmationPayload>(
      authEndpoints.sendEmailConfirmation,
      { body },
    ),
  confirmEmail: (params: TConfirmEmailParams) =>
    callEndpoint<TSimpleResult>(authEndpoints.confirmEmail, {
      queryParams: params,
    }),
  verifyPhone: () => callEndpoint<TSimpleResult>(authEndpoints.verifyPhone),
  getConfirmationStatus: () =>
    callEndpoint<TConfirmationStatusResponse>(
      authEndpoints.confirmationStatus,
    ),
  getCompanies: (isDisabled?: boolean) =>
    callEndpoint<TGetAvailableCompaniesResponse>(authEndpoints.getCompanies, {
      queryParams:
        isDisabled === undefined
          ? undefined
          : { isDisabled: String(isDisabled) },
    }),
  switchCompany: (body: TSwitchCompanyRequest) =>
    callEndpoint<TSwitchCompanyResponse, TSwitchCompanyRequest>(
      authEndpoints.switchCompany,
      { body },
    ),
};