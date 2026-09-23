import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppCheckBox, AppInput } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useSignupForm } from "../hooks/useSignupForm";

const SignupForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, errors, onSubmit } = useSignupForm();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <h1 className="text-2xl font-semibold text-(--naturalBlack)">
          {t("auth.signup.title")}
        </h1>
      </div>

      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            autoComplete="name"
            label={t("auth.signup.fullNameLabel")}
            placeholder={t("auth.signup.fullNamePlaceholder")}
            required
            errorMsg={errors.fullName?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="email"
            autoComplete="email"
            label={t("auth.signup.emailLabel")}
            placeholder={t("auth.signup.emailPlaceholder")}
            required
            errorMsg={errors.email?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="new-password"
            label={t("auth.signup.passwordLabel")}
            placeholder={t("auth.signup.passwordPlaceholder")}
            required
            errorMsg={errors.password?.message}
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
            label={t("auth.signup.confirmPasswordLabel")}
            placeholder={t("auth.signup.confirmPasswordPlaceholder")}
            required
            errorMsg={errors.confirmPassword?.message}
          />
        )}
      />

      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <AppCheckBox
            checked={field.value}
            onChange={(event) => field.onChange(event.target.checked)}
            errorMsg={errors.acceptTerms?.message}
          >
            {t("auth.signup.acceptTerms")}
          </AppCheckBox>
        )}
      />

      <AppButton htmlType="submit" variant="primary" block>
        {t("auth.signup.submit")}
      </AppButton>

      <p className="text-center text-sm text-(--Grey600)">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          to={AUTH_ROUTES.login}
          className="font-medium text-(--naturalBlack) underline underline-offset-4"
        >
          {t("auth.signup.loginLink")}
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
