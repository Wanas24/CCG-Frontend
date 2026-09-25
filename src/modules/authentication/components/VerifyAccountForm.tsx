import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton, AppTag } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useVerifyAccountManager } from "../hooks/useVerifyAccountManager";

const VerifyAccountForm = () => {
  const { t } = useTranslation();
  const {
    email,
    emailConfirmed,
    phoneConfirmed,
    onRefreshStatus,
    onResendEmail,
    onSendPhoneVerification,
    logout,
    isLoggingOut,
    isRefreshing,
    isSendingEmail,
    isSendingPhone,
    isRefreshError,
    isEmailError,
    isPhoneError,
    refreshError,
    emailError,
    phoneError,
    emailMessage,
    phoneMessage,
  } = useVerifyAccountManager();

  const apiError =
    refreshError?.response?.data?.message ||
    emailError?.response?.data?.message ||
    phoneError?.response?.data?.message ||
    "";

  return (
    <div className="flex flex-col gap-6">
      <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
        <ShieldCheck className="w-6 h-6 text-[#3D7A6A]" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.verifyAccount.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {t("auth.verifyAccount.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-(--Grey200) p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-(--app-text)">
              {t("auth.verifyAccount.emailLabel")}
            </p>
            <p className="truncate text-sm text-(--Grey600)">{email}</p>
          </div>
          <AppTag variant={emailConfirmed ? "active" : "pending"}>
            {emailConfirmed
              ? t("auth.verifyAccount.confirmed")
              : t("auth.verifyAccount.pending")}
          </AppTag>
        </div>

        {!emailConfirmed && (
          <AppButton
            variant="secondary"
            loading={isSendingEmail}
            onClick={onResendEmail}
            block
          >
            {t("auth.verifyAccount.resendEmail")}
          </AppButton>
        )}

        {emailMessage && (
          <p className="text-sm text-(--statusG200)">{emailMessage}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-(--Grey200) p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-(--app-text)">
            {t("auth.verifyAccount.phoneLabel")}
          </p>
          <AppTag variant={phoneConfirmed ? "active" : "pending"}>
            {phoneConfirmed
              ? t("auth.verifyAccount.confirmed")
              : t("auth.verifyAccount.pending")}
          </AppTag>
        </div>

        {!phoneConfirmed && (
          <>
            <AppButton
              variant="secondary"
              loading={isSendingPhone}
              onClick={onSendPhoneVerification}
              block
            >
              {t("auth.verifyAccount.sendWhatsApp")}
            </AppButton>

            {phoneMessage && (
              <p className="text-sm text-(--statusG200)">{phoneMessage}</p>
            )}
          </>
        )}
      </div>

      {(isRefreshError || isEmailError || isPhoneError) && (
        <AppErrorContainer error={apiError} />
      )}

      <AppButton
        variant="primary"
        loading={isRefreshing}
        onClick={onRefreshStatus}
        block
      >
        {t("auth.verifyAccount.refreshStatus")}
      </AppButton>

      <AppButton
        variant="tertiary"
        loading={isLoggingOut}
        onClick={logout}
        block
      >
        {t("common.logout")}
      </AppButton>
    </div>
  );
};

export default VerifyAccountForm;
