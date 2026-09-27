import { AUTH_ROUTES } from "../routes/paths";
import { isPublicAuthPath } from "../routes/isPublicAuthPath";
import { authService } from "../api/services/authentication.service";
import { useAuthStore } from "../store/authStore";
import { mapAuthPayloadToUser } from "./mapAuthPayloadToUser";

let refreshPromise: Promise<string> | null = null;

const redirectToLogin = () => {
  if (isPublicAuthPath(window.location.pathname)) {
    return;
  }

  void import("@/router/routes").then(({ router }) => {
    void router.navigate(AUTH_ROUTES.login, { replace: true });
  });
};

export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await authService.refreshToken();
      const { data } = response;

      if (!response.isSuccess || !data?.token || !data.isAuthenticated) {
        throw new Error("Refresh token rejected");
      }

      const store = useAuthStore.getState();
      store.setAccessToken(data.token);
      store.setUser(mapAuthPayloadToUser(data));

      return data.token;
    } catch (error) {
      useAuthStore.getState().logout();
      redirectToLogin();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
