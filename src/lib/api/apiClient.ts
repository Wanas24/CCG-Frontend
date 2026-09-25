import axios from "axios";
import { getStoredLocale } from "@/i18n";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TSimpleResult } from "@/modules/authentication/types";

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

apiClient.interceptors.request.use((config) => {
  config.headers.set("X-Language", getStoredLocale());

  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 403) {
      return Promise.reject(error);
    }

    const payload = error.response.data as TSimpleResult | undefined;
    if (payload?.errorCode !== 1) {
      return Promise.reject(error);
    }

    if (isVerificationBypassPath(error.config?.url)) {
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
