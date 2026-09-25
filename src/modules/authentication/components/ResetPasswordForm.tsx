import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppInput } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import type { ResetPasswordParams } from "@/modules/authentication/types/auth";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

type Props = ResetPasswordParams;

const ResetPasswordForm = ({ userId, token }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { control, handleSubmit, errors, onSubmit } = useResetPasswordForm({
    userId,
    token,
  });

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
        render={({ field }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="new-password"
            label={t("auth.resetPassword.passwordLabel")}
            placeholder={t("auth.resetPassword.passwordPlaceholder")}
            required
            errorMsg={translateError(errors.password?.message)}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="new-password"
            label={t("auth.resetPassword.confirmPasswordLabel")}
            placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
            required
            errorMsg={translateError(errors.confirmPassword?.message)}
          />
        )}
      />

      <AppButton htmlType="submit" variant="primary" block>
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
