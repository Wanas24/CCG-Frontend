import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import { AppButton, AppInput } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import type { TResetPasswordParams } from "@/modules/authentication/types";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

type Props = TResetPasswordParams;

const ResetPasswordForm = ({ email, token }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isSuccess,
    successMessage,
  } = useResetPasswordForm({
    email,
    token,
  });

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
          <KeyRound className="w-6 h-6 text-[#3D7A6A]" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--app-text)">
            {t("auth.resetPassword.successTitle")}
          </h1>
          <p className="text-sm text-(--Grey600)">
            {successMessage || t("auth.resetPassword.successDescription")}
          </p>
        </div>

        <Link to={AUTH_ROUTES.login}>
          <AppButton variant="primary" block>
            {t("auth.resetPassword.backToLogin")}
          </AppButton>
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.resetPassword.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="new-password"
            label={t("auth.resetPassword.passwordLabel")}
            placeholder={t("auth.resetPassword.passwordPlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="new-password"
            label={t("auth.resetPassword.confirmPasswordLabel")}
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <AppButton
        htmlType="submit"
        variant="primary"
        block
        loading={isPending}
      >
        {t("auth.resetPassword.submit")}
      </AppButton>

      <Link
        to={AUTH_ROUTES.login}
        className="text-center text-sm text-(--Grey700) underline underline-offset-4"
      >
        {t("auth.resetPassword.backToLogin")}
      </Link>
    </form>
  );
};

export default ResetPasswordForm;
