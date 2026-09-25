import axios, { type InternalAxiosRequestConfig } from "axios";
import { getStoredLocale } from "@/i18n";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TSimpleResult } from "@/modules/authentication/types";
import { isAccessTokenExpired } from "@/modules/authentication/utils/getJwtExpiration";
import { authEndpoints } from "@/modules/authentication/api/endPoints/authentication.endpoints";
import { ErrorCode } from "./errorCodes";
import { handleApiResult, registerErrorHandler } from "./apiResultHandler";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
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

const navigateTo = (path: string) => {
  void import("@/router/routes").then(({ router }) => {
    void router.navigate(path, { replace: true });
  });
};

// --- Error code handlers ---

registerErrorHandler(ErrorCode.AccountVerificationRequired, () => {
  useAuthStore.getState().setConfirmationStatus({
    emailConfirmed: false,
    phoneNumberConfirmed: false,
  });
  if (window.location.pathname !== AUTH_ROUTES.verifyAccount) {
    navigateTo(AUTH_ROUTES.verifyAccount);
  }
});

registerErrorHandler(ErrorCode.Unauthorized, () => {
  useAuthStore.getState().logout();
  if (window.location.pathname !== AUTH_ROUTES.login) {
    navigateTo(AUTH_ROUTES.login);
  }
});

registerErrorHandler(ErrorCode.Forbidden, () => {
  useAuthStore.getState().logout();
  if (window.location.pathname !== AUTH_ROUTES.login) {
    navigateTo(AUTH_ROUTES.login);
  }
});

// --- Axios instance ---

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// --- Request interceptor ---

apiClient.interceptors.request.use(async (config) => {
  config.headers.set("X-Language", getStoredLocale());

  if (isRefreshTokenPath(config.url)) {
    return config;
  }

  let accessToken = useAuthStore.getState().accessToken;

  if (accessToken && isAccessTokenExpired(accessToken)) {
    const { refreshAccessToken } =
      await import("@/modules/authentication/utils/refreshAccessToken");
    accessToken = await refreshAccessToken();
  }

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// --- Response interceptors ---

apiClient.interceptors.response.use(
  (response) => {
    const result = response.data as TSimpleResult | undefined;
    const skipToast = response.config.skipToast;

    if (
      result &&
      typeof result === "object" &&
      "isSuccess" in result &&
      !result.isSuccess
    ) {
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
    const toastOptions = { skipToast: config.skipToast };

    // 401 — check errorCode before attempting refresh
    if (status === 401 && !isRefreshTokenPath(config.url) && !config._retry) {
      if (payload?.errorCode === ErrorCode.Unauthorized) {
        handleApiResult(payload, toastOptions);
        return Promise.reject(error);
      }

      config._retry = true;
      try {
        const { refreshAccessToken } =
          await import("@/modules/authentication/utils/refreshAccessToken");
        const accessToken = await refreshAccessToken();
        config.headers.set("Authorization", `Bearer ${accessToken}`);
        return apiClient.request(config);
      } catch {
        return Promise.reject(error);
      }
    }

    // 403 — guard bypass paths to avoid redirect loops on verification endpoints
    if (status === 403) {
      if (
        payload?.errorCode === ErrorCode.AccountVerificationRequired &&
        isVerificationBypassPath(config.url)
      ) {
        if (payload?.isSuccess === false) {
          handleApiResult(
            { isSuccess: false, message: payload.message, errorCode: null },
            toastOptions,
          );
        }
        return Promise.reject(error);
      }

      if (payload?.isSuccess === false) {
        handleApiResult(payload, toastOptions);
      }
      return Promise.reject(error);
    }

    // All other errors (400, 422, 500, …)
    if (payload?.isSuccess === false) {
      handleApiResult(payload, toastOptions);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
