import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useAuthStore } from "@/modules/authentication/store/authStore";

export const markPhoneVerificationPending = () => {
  const { confirmationStatus, setConfirmationStatus } = useAuthStore.getState();

  setConfirmationStatus({
    emailConfirmed: confirmationStatus?.emailConfirmed ?? false,
    phoneNumberConfirmed: false,
  });
};

export const navigateToPhoneVerification = () => {
  markPhoneVerificationPending();

  if (window.location.pathname === AUTH_ROUTES.verifyAccount) {
    return;
  }

  void import("@/router/routes").then(({ router }) => {
    void router.navigate(AUTH_ROUTES.verifyAccount, { replace: true });
  });
};
