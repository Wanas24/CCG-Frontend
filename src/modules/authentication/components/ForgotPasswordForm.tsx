import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppInput } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

const ForgotPasswordForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, errors, onSubmit } = useForgotPasswordForm();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--naturalBlack)">
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
            errorMsg={errors.email?.message}
          />
        )}
      />

      <AppButton htmlType="submit" variant="primary" block>
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
