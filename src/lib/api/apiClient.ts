import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getStoredLocale } from "@/i18n";
import i18n from "@/i18n/config";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TSimpleResult } from "@/modules/authentication/types";
import { isAccessTokenExpired } from "@/modules/authentication/utils/getJwtExpiration";
import { authEndpoints } from "@/modules/authentication/api/endPoints/authentication.endpoints";
import { ErrorCode } from "./errorCodes";
import { handleApiResult } from "./apiResultHandler";
import { registerAuthErrorHandlers } from "./registerAuthErrorHandlers";
import {
  getNetworkErrorMessage,
  isSimpleResult,
  toFailedSimpleResult,
} from "./normalizeApiError";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ToastOptions = {
  skipToast?: boolean;
};

const VERIFICATION_BYPASS_PATHS = [
  "/auth/confirmation-status",
  "/auth/verify-phone",
  "/auth/send-email-confirmation",
  "/auth/confirm-email",
];

const isVerificationBypassPath = (url?: string) => {
  if (!url) return false;
  return VERIFICATION_BYPASS_PATHS.some((path) => url.includes(path));
};

const isRefreshTokenPath = (url?: string) => {
  if (!url) return false;
  return url.includes(authEndpoints.refreshToken.path);
};

const getRefreshedAccessToken = async (): Promise<string> => {
  const { refreshAccessToken } =
    await import("@/modules/authentication/utils/refreshAccessToken");
  return refreshAccessToken();
};

const handleTransportError = (
  error: AxiosError,
  toastOptions: ToastOptions,
) => {
  if (toastOptions.skipToast) {
    return Promise.reject(error);
  }

  handleApiResult(
    {
      isSuccess: false,
      message: getNetworkErrorMessage(error.code),
      errorCode: null,
    },
    toastOptions,
  );
  return Promise.reject(error);
};

const handleHttpErrorPayload = (
  payload: unknown,
  status: number | undefined,
  toastOptions: ToastOptions,
) => {
  if (isSimpleResult(payload) && !payload.isSuccess) {
    handleApiResult(payload, toastOptions);
    return;
  }

  const fallbackMessage =
    status !== undefined && status >= 500
      ? i18n.t("common.serverError")
      : i18n.t("common.unexpectedError");

  handleApiResult(toFailedSimpleResult(payload, fallbackMessage), toastOptions);
};

// 401 — JWT challenge (errorCode 2): refresh once; user-gone (no code): logout
const handle401Error = async (
  error: AxiosError,
  config: RetryableRequestConfig,
  payload: TSimpleResult | undefined,
  toastOptions: ToastOptions,
) => {
  const isUserGone =
    isSimpleResult(payload) &&
    !payload.isSuccess &&
    (payload.errorCode === null || payload.errorCode === undefined);

  if (isUserGone) {
    handleApiResult(
      {
        isSuccess: false,
        message: payload.message,
        errorCode: ErrorCode.Unauthorized,
      },
      toastOptions,
    );
    return Promise.reject(error);
  }

  config._retry = true;
  try {
    const accessToken = await getRefreshedAccessToken();
    config.headers.set("Authorization", `Bearer ${accessToken}`);
    return apiClient.request(config);
  } catch {
    return Promise.reject(error);
  }
};

// 403 — bypass verification endpoints to avoid redirect loops
const handle403Error = (
  error: AxiosError,
  config: RetryableRequestConfig,
  payload: TSimpleResult | undefined,
  toastOptions: ToastOptions,
) => {
  if (
    payload?.errorCode === ErrorCode.AccountVerificationRequired &&
    isVerificationBypassPath(config.url)
  ) {
    if (isSimpleResult(payload) && !payload.isSuccess) {
      handleApiResult(
        { isSuccess: false, message: payload.message, errorCode: null },
        toastOptions,
      );
    }
    return Promise.reject(error);
  }

  handleHttpErrorPayload(payload, 403, toastOptions);
  return Promise.reject(error);
};

registerAuthErrorHandlers();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  config.headers.set("X-Language", getStoredLocale());

  if (isRefreshTokenPath(config.url)) {
    return config;
  }

  let accessToken = useAuthStore.getState().accessToken;

  if (accessToken && isAccessTokenExpired(accessToken)) {
    accessToken = await getRefreshedAccessToken();
  }

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const result = response.data;
    const skipToast = response.config.skipToast;

    if (isSimpleResult(result) && !result.isSuccess) {
      handleApiResult(result, { skipToast });
    }
    return response;
  },
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as RetryableRequestConfig;
    const status = error.response?.status;
    const payload = error.response?.data as TSimpleResult | undefined;
    const toastOptions: ToastOptions = { skipToast: config.skipToast };

    if (!error.response) {
      return handleTransportError(error, toastOptions);
    }

    if (status === 401 && !isRefreshTokenPath(config.url) && !config._retry) {
      return handle401Error(error, config, payload, toastOptions);
    }

    if (status === 401 && config._retry) {
      const message = isSimpleResult(payload)
        ? payload.message
        : i18n.t("common.unexpectedError");

      handleApiResult(
        {
          isSuccess: false,
          message,
          errorCode: ErrorCode.Unauthorized,
        },
        toastOptions,
      );
      return Promise.reject(error);
    }

    if (status === 403) {
      return handle403Error(error, config, payload, toastOptions);
    }

    handleHttpErrorPayload(payload, status, toastOptions);
    return Promise.reject(error);
  },
);

export default apiClient;
