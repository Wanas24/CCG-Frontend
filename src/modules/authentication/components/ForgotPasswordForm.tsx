import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MailCheck } from "lucide-react";
import { AppButton, AppInput } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useTranslatedFormError } from "@/shared/validation";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    isError,
    isSuccess,
    forgotPasswordError,
    successMessage,
  } = useForgotPasswordForm();

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-5">
        <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-[#3D7A6A]" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-(--app-text)">
            {t("auth.forgotPassword.successTitle")}
          </h1>
          <p className="text-sm text-(--Grey600)">
            {successMessage || t("auth.forgotPassword.successDescription")}
          </p>
        </div>

        <Link
          to={AUTH_ROUTES.login}
          className="text-center text-sm text-(--Grey700) underline underline-offset-4"
        >
          {t("auth.forgotPassword.backToLogin")}
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
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="email"
            autoComplete="email"
            label={t("auth.forgotPassword.emailLabel")}
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            required
            errorMsg={translateError(errors.email?.message)}
          />
        )}
      />

      {isError && (
        <AppErrorContainer
          error={forgotPasswordError?.response?.data.message || ""}
        />
      )}

      <AppButton
        htmlType="submit"
        variant="primary"
        block
        loading={isPending}
      >
        {t("auth.forgotPassword.submit")}
      </AppButton>

      <Link
        to={AUTH_ROUTES.login}
        className="text-center text-sm text-(--Grey700) underline underline-offset-4"
      >
        {t("auth.forgotPassword.backToLogin")}
      </Link>
    </form>
  );
};

export default ForgotPasswordForm;
