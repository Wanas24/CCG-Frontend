import axios, { type InternalAxiosRequestConfig } from "axios";
import { getStoredLocale } from "@/i18n";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TSimpleResult } from "@/modules/authentication/types";
import { isAccessTokenExpired } from "@/modules/authentication/utils/getJwtExpiration";
import { authEndpoints } from "@/modules/authentication/api/endPoints/authentication.endpoints";

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

const redirectToVerifyAccount = () => {
  if (window.location.pathname === AUTH_ROUTES.verifyAccount) {
    return;
  }

  void import("@/router/routes").then(({ router }) => {
    void router.navigate(AUTH_ROUTES.verifyAccount, { replace: true });
  });
};

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
    const { refreshAccessToken } =
      await import("@/modules/authentication/utils/refreshAccessToken");
    accessToken = await refreshAccessToken();
  }

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as RetryableRequestConfig;
    const status = error.response?.status;

    if (status === 401 && !isRefreshTokenPath(config.url) && !config._retry) {
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

    if (status !== 403) {
      return Promise.reject(error);
    }

    const payload = error.response?.data as TSimpleResult | undefined;
    if (payload?.errorCode !== 1) {
      return Promise.reject(error);
    }

    if (isVerificationBypassPath(config.url)) {
      return Promise.reject(error);
    }

    useAuthStore.getState().setConfirmationStatus({
      emailConfirmed: false,
      phoneNumberConfirmed: false,
    });

    redirectToVerifyAccount();

    return Promise.reject(error);
  },
);

export default apiClient;
