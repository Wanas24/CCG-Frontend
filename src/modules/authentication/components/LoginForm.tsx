import { KeyRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppCheckBox, AppInput } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

import { useLoginForm } from "../hooks/useLoginForm";

const LoginForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, errors, onSubmit } = useLoginForm();

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Key icon placeholder — replace with actual icon */}
      <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
        <KeyRound className="w-6 h-6 text-[#3D7A6A]" />
      </div>

      {/* Title + subtitle */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-(--naturalBlack)">
          {t("auth.login.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">{t("auth.login.subtitle")}</p>
      </div>

      {/* Email field */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="email"
            autoComplete="email"
            label={t("auth.login.emailLabel")}
            placeholder={t("auth.login.emailPlaceholder")}
            required
            errorMsg={errors.email?.message}
          />
        )}
      />

      {/* Password field */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="current-password"
            label={t("auth.login.passwordLabel")}
            placeholder={t("auth.login.passwordPlaceholder")}
            required
            errorMsg={errors.password?.message}
          />
        )}
      />

      {/* Remember me + Server badge */}
      <div className="flex items-center justify-between gap-3">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <AppCheckBox
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
            >
              {t("auth.login.rememberMe")}
            </AppCheckBox>
          )}
        />
      </div>

      {/* Submit button */}
      <AppButton htmlType="submit" variant="primary" block>
        {t("auth.login.submit")} →
      </AppButton>

      {/* Credentials info */}
      <div className="flex items-center justify-center gap-2 text-xs text-(--Grey600)">
        {/* Shield icon placeholder — replace with actual icon */}
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{t("auth.login.credentialsNote")}</span>
      </div>

      {/* Divider */}
      <hr className="border-t border-(--Grey200)" />

      {/* Forgot password + Create account */}
      <div className="flex items-center justify-between text-sm">
        <Link
          to={AUTH_ROUTES.forgotPassword}
          className="text-(--Grey600) underline underline-offset-4 hover:text-(--naturalBlack) transition-colors"
        >
          {t("auth.login.forgotPassword")}
        </Link>
        <Link
          to={AUTH_ROUTES.signup}
          className="font-medium text-(--naturalBlack) underline underline-offset-4 hover:text-(--Grey700) transition-colors"
        >
          {t("auth.login.signupLink")}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
