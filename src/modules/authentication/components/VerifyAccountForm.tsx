import { Check, CircleDashed, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton, AppTag } from "@/shared/ANTD_UIComponents";
import { useVerifyAccountManager } from "../hooks/useVerifyAccountManager";

const StepIcon = ({
  done,
  Icon,
}: {
  done: boolean;
  Icon: typeof Mail;
}) => (
  <div
    className={
      done
        ? "flex size-11 shrink-0 items-center justify-center rounded-full bg-(--statusG200) text-white"
        : "flex size-11 shrink-0 items-center justify-center rounded-full border border-(--Grey400) bg-(--app-surface) text-(--Grey600)"
    }
  >
    {done ? <Check size={20} strokeWidth={2.5} /> : <Icon size={20} />}
  </div>
);

const VerifyAccountForm = () => {
  const { t } = useTranslation();
  const {
    email,
    emailConfirmed,
    phoneConfirmed,
    onResendEmail,
    onSendPhoneVerification,
    goHome,
    logout,
    isLoggingOut,
    isSendingEmail,
    isSendingPhone,
    emailMessage,
    phoneMessage,
  } = useVerifyAccountManager();

  const completedCount = Number(emailConfirmed) + Number(phoneConfirmed);

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-(--Grey600)">
            <CircleDashed size={14} />
            {t("auth.verifyAccount.badge")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-(--app-text) sm:text-3xl">
            {t("auth.verifyAccount.title")}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-(--Grey600)">
            {t("auth.verifyAccount.subtitle")}
          </p>
        </div>

        <AppButton variant="secondary" onClick={goHome}>
          {t("auth.verifyAccount.backToHome")}
        </AppButton>
      </div>

      <div className="mb-4 flex items-center gap-3 text-sm text-(--Grey600)">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--Grey200)">
          <div
            className="h-full rounded-full bg-(--statusB200) transition-[width] duration-500"
            style={{ width: `${(completedCount / 2) * 100}%` }}
          />
        </div>
        <span className="tabular-nums">
          {t("auth.verifyAccount.progress", { done: completedCount, total: 2 })}
        </span>
      </div>

      <ol className="flex flex-col gap-0 border-s-2 border-(--Grey300) ms-5">
        <li className="relative pb-5 ps-8">
          <span className="absolute inset-s-[-1.4rem] top-0">
            <StepIcon done={emailConfirmed} Icon={Mail} />
          </span>
          <div className="flex flex-col gap-3 rounded-2xl bg-(--app-surface)/80 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-medium text-(--app-text)">
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
                variant="primary"
                loading={isSendingEmail}
                onClick={onResendEmail}
              >
                {t("auth.verifyAccount.resendEmail")}
              </AppButton>
            )}

            {emailMessage && (
              <p className="text-sm text-(--statusG200)">{emailMessage}</p>
            )}
          </div>
        </li>

        <li className="relative ps-8">
          <span className="absolute inset-s-[-1.4rem] top-0">
            <StepIcon done={phoneConfirmed} Icon={Phone} />
          </span>
          <div className="flex flex-col gap-3 rounded-2xl bg-(--app-surface)/80 p-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-base font-medium text-(--app-text)">
                {t("auth.verifyAccount.phoneLabel")}
              </p>
              <AppTag variant={phoneConfirmed ? "active" : "pending"}>
                {phoneConfirmed
                  ? t("auth.verifyAccount.confirmed")
                  : t("auth.verifyAccount.pending")}
              </AppTag>
            </div>

            {!phoneConfirmed && (
              <AppButton
                variant="primary"
                loading={isSendingPhone}
                onClick={onSendPhoneVerification}
              >
                {t("auth.verifyAccount.sendWhatsApp")}
              </AppButton>
            )}

            {phoneMessage && (
              <p className="text-sm text-(--statusG200)">{phoneMessage}</p>
            )}
          </div>
        </li>
      </ol>

      <div className="mt-5 flex flex-col items-stretch justify-between gap-3 border-t border-(--Grey300)/80 pt-4 sm:flex-row sm:items-center">
        <p className="text-sm text-(--Grey600)">
          {t("auth.verifyAccount.autoCheckHint")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton variant="secondary" onClick={goHome}>
            {t("auth.verifyAccount.backToHome")}
          </AppButton>
          <AppButton
            variant="tertiary"
            loading={isLoggingOut}
            onClick={logout}
          >
            {t("common.logout")}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountForm;
