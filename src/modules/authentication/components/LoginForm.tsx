import { KeyRound } from "lucide-react";
import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppCheckBox, AppInput } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useLoginManager } from "../hooks/useLoginManager";

const LoginForm = () => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { control, handleSubmit, onSubmit, isPending } = useLoginManager();

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="w-10 h-10 rounded-xl bg-(--Primary100) flex items-center justify-center">
        <KeyRound className="w-6 h-6 text-(--Primary400)" />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.login.title")}
        </h1>
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            type="email"
            autoComplete="email"
            label={t("auth.login.emailLabel")}
            placeholder={t("auth.login.emailPlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            type="password"
            autoComplete="current-password"
            label={t("auth.login.passwordLabel")}
            placeholder={t("auth.login.passwordPlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

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

      <AppButton htmlType="submit" variant="primary" loading={isPending}>
        {t("auth.login.submit")} →
      </AppButton>

      <hr className="border-t border-(--Grey200)" />

      <div className="flex items-center justify-between text-sm">
        <Link
          to={AUTH_ROUTES.forgotPassword}
          className="text-(--Grey600) underline underline-offset-4 hover:text-(--app-text) transition-colors"
        >
          {t("auth.login.forgotPassword")}
        </Link>
        <Link
          to={AUTH_ROUTES.signup}
          className="font-medium text-(--app-text) underline underline-offset-4 hover:text-(--Grey700) transition-colors"
        >
          {t("auth.login.signupLink")}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
