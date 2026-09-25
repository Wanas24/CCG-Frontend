import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { ErrorCode } from "./errorCodes";
import { registerErrorHandler } from "./apiResultHandler";

const navigateTo = (path: string) => {
  void import("@/router/routes").then(({ router }) => {
    void router.navigate(path, { replace: true });
  });
};

let initialized = false;

export const registerAuthErrorHandlers = () => {
  if (initialized) return;

  initialized = true;

  registerErrorHandler(ErrorCode.AccountVerificationRequired, () => {
    useAuthStore.getState().setConfirmationStatus({
      emailConfirmed: false,
      phoneNumberConfirmed: false,
    });

    if (window.location.pathname !== AUTH_ROUTES.verifyAccount) {
      navigateTo(AUTH_ROUTES.verifyAccount);
    }
  });

  const logoutHandler = () => {
    useAuthStore.getState().logout();

    if (window.location.pathname !== AUTH_ROUTES.login) {
      navigateTo(AUTH_ROUTES.login);
    }
  };

  registerErrorHandler(ErrorCode.Unauthorized, logoutHandler);
};
