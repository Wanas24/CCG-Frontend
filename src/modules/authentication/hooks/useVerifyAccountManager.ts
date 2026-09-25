import { useNavigate } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useConfirmationStatus } from "../api/hooks/useConfirmationStatus";
import { useSendEmailConfirmation } from "../api/hooks/useSendEmailConfirmation";
import { useVerifyPhone } from "../api/hooks/useVerifyPhone";
import { useLogoutManager } from "./useLogoutManager";
import { useAuthStore } from "../store/authStore";
import { isAccountVerified } from "../types";

export const useVerifyAccountManager = () => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.user?.email ?? "");
  const confirmationStatus = useAuthStore((state) => state.confirmationStatus);
  const setConfirmationStatus = useAuthStore(
    (state) => state.setConfirmationStatus,
  );
  const { logout, isPending: isLoggingOut } = useLogoutManager();

  const {
    mutate: refreshStatus,
    isPending: isRefreshing,
    isSuccess: isRefreshSuccess,
    data: refreshData,
  } = useConfirmationStatus();

  const {
    mutate: sendEmail,
    isPending: isSendingEmail,
    isSuccess: isEmailSuccess,
    data: emailData,
    reset: resetEmail,
  } = useSendEmailConfirmation();

  const {
    mutate: sendPhone,
    isPending: isSendingPhone,
    isSuccess: isPhoneSuccess,
    data: phoneData,
    reset: resetPhone,
  } = useVerifyPhone();

  const applyStatusAndNavigate = (
    status: { emailConfirmed: boolean; phoneNumberConfirmed: boolean } | null,
  ) => {
    setConfirmationStatus(status);
    if (isAccountVerified(status)) {
      navigate(APP_ROUTES.home, { replace: true });
    }
  };

  const onRefreshStatus = () => {
    refreshStatus(undefined, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          applyStatusAndNavigate(response.data ?? null);
        }
      },
    });
  };

  const onResendEmail = () => {
    if (!email) return;
    resetEmail();
    sendEmail({ email });
  };

  const onSendPhoneVerification = () => {
    resetPhone();
    sendPhone();
  };

  return {
    email,
    emailConfirmed: confirmationStatus?.emailConfirmed ?? false,
    phoneConfirmed: confirmationStatus?.phoneNumberConfirmed ?? false,
    onRefreshStatus,
    onResendEmail,
    onSendPhoneVerification,
    logout,
    isLoggingOut,
    isRefreshing,
    isSendingEmail,
    isSendingPhone,
    emailMessage: isEmailSuccess ? emailData?.message : undefined,
    phoneMessage: isPhoneSuccess ? phoneData?.message : undefined,
    refreshMessage: isRefreshSuccess ? refreshData?.message : undefined,
  };
};
