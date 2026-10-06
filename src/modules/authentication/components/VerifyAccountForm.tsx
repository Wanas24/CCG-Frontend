import { Check, CircleDashed, Mail, Phone } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppPhoneInput,
  AppTag,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
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
  const translateError = useTranslatedFormError();
  const {
    email,
    phoneNumber,
    isPhoneLoading,
    emailConfirmed,
    phoneConfirmed,
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
    emailMessage,
    phoneMessage,
    hasSentPhoneCode,
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
              <>
                {isEditingPhone ? (
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={handlePhoneSubmit(onSubmitPhoneChange)}
                    noValidate
                  >
                    <Controller
                      name="phoneNumber"
                      control={phoneControl}
                      render={({ field, fieldState }) => (
                        <AppPhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          inputProps={{ autoComplete: "tel" }}
                          label={t("auth.verifyAccount.phoneNumberLabel")}
                          placeholder={t(
                            "auth.verifyAccount.phoneNumberPlaceholder",
                          )}
                          required
                          errorMsg={translateError(fieldState.error?.message)}
                        />
                      )}
                    />
                    <div className="flex flex-wrap gap-2">
                      <AppButton
                        htmlType="submit"
                        variant="primary"
                        loading={isChangingPhone || isSendingPhone}
                        disabled={!canSubmitPhoneChange}
                      >
                        {t("auth.verifyAccount.saveNumber")}
                      </AppButton>
                      <AppButton
                        variant="secondary"
                        htmlType="button"
                        disabled={isChangingPhone}
                        onClick={cancelEditPhone}
                      >
                        {t("auth.verifyAccount.cancelChangeNumber")}
                      </AppButton>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-3">
                    <p className="m-0 text-sm text-(--Grey600)">
                      {hasSentPhoneCode
                        ? t("auth.verifyAccount.phoneSentTo")
                        : t("auth.verifyAccount.phoneWillSendTo")}
                    </p>
                    {isPhoneLoading ? (
                      <p className="m-0 text-sm text-(--Grey500)">
                        {t("common.loading")}
                      </p>
                    ) : phoneNumber ? (
                      <p className="m-0 text-base font-semibold tracking-wide text-(--app-text)">
                        {phoneNumber}
                      </p>
                    ) : (
                      <p className="m-0 text-sm text-(--Grey500)">
                        {t("auth.verifyAccount.phoneMissing")}
                      </p>
                    )}
                    <AppButton
                      variant="tertiary"
                      className="h-auto! w-fit! px-0!"
                      onClick={startEditPhone}
                    >
                      {t("auth.verifyAccount.changeNumber")}
                    </AppButton>
                  </div>
                )}

                {!isEditingPhone && (
                  <AppButton
                    variant="primary"
                    loading={isSendingPhone}
                    onClick={onSendPhoneVerification}
                  >
                    {t("auth.verifyAccount.sendWhatsApp")}
                  </AppButton>
                )}
              </>
            )}

            {phoneConfirmed && phoneNumber ? (
              <p className="m-0 text-sm text-(--Grey600)">{phoneNumber}</p>
            ) : null}

            {phoneMessage && !isEditingPhone ? (
              <p className="text-sm text-(--statusG200)">{phoneMessage}</p>
            ) : null}
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
