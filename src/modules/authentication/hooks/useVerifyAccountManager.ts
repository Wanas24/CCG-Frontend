import { useEffect } from "react";
import { useNavigate } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import {
  CONFIRMATION_STATUS_POLL_INTERVAL_MS,
  useConfirmationStatus,
} from "../api/hooks/useConfirmationStatus";
import { useSendEmailConfirmation } from "../api/hooks/useSendEmailConfirmation";
import { useVerifyPhone } from "../api/hooks/useVerifyPhone";
import { queryClient } from "@/lib/queryClient";
import { userMeQueryKey } from "@/modules/user/api/hooks/useGetMe";
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

  const isVerified = isAccountVerified(confirmationStatus);

  const { data: statusResponse } = useConfirmationStatus({
    enabled: !isVerified,
    refetchInterval: CONFIRMATION_STATUS_POLL_INTERVAL_MS,
  });

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

  useEffect(() => {
    if (!statusResponse?.isSuccess) return;

    const status = statusResponse.data ?? null;
    setConfirmationStatus(status);

    if (status?.phoneNumberConfirmed) {
      void queryClient.invalidateQueries({ queryKey: userMeQueryKey });
    }

    if (isAccountVerified(status)) {
      navigate(APP_ROUTES.home, { replace: true });
    }
  }, [statusResponse, setConfirmationStatus, navigate]);

  const onResendEmail = () => {
    if (!email) return;
    resetEmail();
    sendEmail({ email });
  };

  const onSendPhoneVerification = () => {
    resetPhone();
    sendPhone();
  };

  const goHome = () => {
    navigate(APP_ROUTES.home);
  };

  return {
    email,
    emailConfirmed: confirmationStatus?.emailConfirmed ?? false,
    phoneConfirmed: confirmationStatus?.phoneNumberConfirmed ?? false,
    onResendEmail,
    onSendPhoneVerification,
    goHome,
    logout,
    isLoggingOut,
    isSendingEmail,
    isSendingPhone,
    emailMessage: isEmailSuccess ? emailData?.message : undefined,
    phoneMessage: isPhoneSuccess ? phoneData?.message : undefined,
  };
};
