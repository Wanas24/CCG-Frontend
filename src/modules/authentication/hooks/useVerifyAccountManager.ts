import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import {
  applyApiFieldErrors,
  getSimpleResultFromAxiosError,
} from "@/lib/api/applyApiFieldErrors";
import { ErrorCode } from "@/lib/api/errorCodes";
import { queryClient } from "@/lib/queryClient";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { useGetMe, userMeQueryKey } from "@/modules/user/api/hooks/useGetMe";
import { useChangePhone } from "@/modules/user/api/hooks/useChangePhone";
import {
  changePhoneSchema,
  type ChangePhoneFormValues,
} from "@/modules/user/schemas";
import { markPhoneVerificationPending } from "@/modules/user/utils/startPhoneVerification";
import {
  CONFIRMATION_STATUS_POLL_INTERVAL_MS,
  useConfirmationStatus,
} from "../api/hooks/useConfirmationStatus";
import { useSendEmailConfirmation } from "../api/hooks/useSendEmailConfirmation";
import { useVerifyPhone } from "../api/hooks/useVerifyPhone";
import { useLogoutManager } from "./useLogoutManager";
import { useAuthStore } from "../store/authStore";
import { isAccountVerified } from "../types";
import { getPostVerificationPath } from "../utils/getPostVerificationPath";

const isVerificationRequired = (errorCode?: number | null) =>
  Number(errorCode) === ErrorCode.AccountVerificationRequired;

export const useVerifyAccountManager = () => {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.user?.email ?? "");
  const confirmationStatus = useAuthStore((state) => state.confirmationStatus);
  const setConfirmationStatus = useAuthStore(
    (state) => state.setConfirmationStatus,
  );
  const { logout, isPending: isLoggingOut } = useLogoutManager();
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const isVerified = isAccountVerified(confirmationStatus);

  const { data: meResponse, isPending: isPhoneLoading } = useGetMe();
  const phoneNumber =
    meResponse?.isSuccess && meResponse.data?.phoneNumber
      ? meResponse.data.phoneNumber
      : "";

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

  const { mutate: changePhoneMutate, isPending: isChangingPhone } =
    useChangePhone();

  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    setError: setPhoneError,
    reset: resetPhoneForm,
    formState: phoneFormState,
  } = useForm<ChangePhoneFormValues>({
    resolver: zodResolver(changePhoneSchema),
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  const editedPhoneNumber = useWatch({
    control: phoneControl,
    name: "phoneNumber",
  });

  useEffect(() => {
    if (!isEditingPhone) {
      resetPhoneForm({ phoneNumber: phoneNumber || "" });
    }
  }, [phoneNumber, isEditingPhone, resetPhoneForm]);

  useEffect(() => {
    if (!statusResponse?.isSuccess) return;

    const status = statusResponse.data ?? null;
    setConfirmationStatus(status);

    if (status?.phoneNumberConfirmed) {
      void queryClient.invalidateQueries({ queryKey: userMeQueryKey });
    }

    if (isAccountVerified(status)) {
      navigate(getPostVerificationPath(), { replace: true });
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

  const startEditPhone = () => {
    resetPhoneForm({ phoneNumber: phoneNumber || "" });
    setIsEditingPhone(true);
  };

  const cancelEditPhone = () => {
    resetPhoneForm({ phoneNumber: phoneNumber || "" });
    setIsEditingPhone(false);
  };

  const onChangePhoneSuccess = async (nextPhone: string) => {
    markPhoneVerificationPending();
    resetPhone();
    setIsEditingPhone(false);
    resetPhoneForm({ phoneNumber: nextPhone });
    await queryClient.invalidateQueries({ queryKey: userMeQueryKey });
    sendPhone();
  };

  const onSubmitPhoneChange = (values: ChangePhoneFormValues) => {
    if (values.phoneNumber === phoneNumber) {
      setIsEditingPhone(false);
      return;
    }

    changePhoneMutate(
      { phoneNumber: values.phoneNumber },
      {
        onSuccess: (response) => {
          if (
            isVerificationRequired(response.errorCode) ||
            response.isSuccess
          ) {
            void onChangePhoneSuccess(values.phoneNumber);
            return;
          }

          applyApiFieldErrors(setPhoneError, response.data);
        },
        onError: (error) => {
          const result = getSimpleResultFromAxiosError(error);

          if (isVerificationRequired(result?.errorCode)) {
            void onChangePhoneSuccess(values.phoneNumber);
            return;
          }

          applyApiFieldErrors(setPhoneError, result?.data);
        },
      },
    );
  };

  const hasPhoneChanged = editedPhoneNumber !== phoneNumber;
  const canSubmitPhoneChange =
    hasPhoneChanged && phoneFormState.isValid && !isChangingPhone;

  const goHome = () => {
    navigate(APP_ROUTES.home);
  };

  return {
    email,
    phoneNumber,
    isPhoneLoading,
    emailConfirmed: confirmationStatus?.emailConfirmed ?? false,
    phoneConfirmed: confirmationStatus?.phoneNumberConfirmed ?? false,
    isEditingPhone,
    phoneControl,
    canSubmitPhoneChange,
    startEditPhone,
    cancelEditPhone,
    handlePhoneSubmit,
    onSubmitPhoneChange,
    onResendEmail,
    onSendPhoneVerification,
    goHome,
    logout,
    isLoggingOut,
    isSendingEmail,
    isSendingPhone,
    isChangingPhone,
    emailMessage: isEmailSuccess ? emailData?.message : undefined,
    phoneMessage: isPhoneSuccess ? phoneData?.message : undefined,
    hasSentPhoneCode: isPhoneSuccess,
  };
};
