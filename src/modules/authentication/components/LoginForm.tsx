import { Link, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AppButton, AppCheckBox, AppInput } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/modules/authentication/schemas";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const schema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@admin.com",
      password: "admin@123",
      rememberMe: false,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    // Authentication API integration is out of ST-01 scope.
    if (values.email === "admin@admin.com" && values.password === "admin@123") {
      localStorage.setItem("CCG_TOKEN", "admin");
      navigate(APP_ROUTES.home);
    } else {
      localStorage.removeItem("CCG_TOKEN");
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--naturalBlack)">
          {t("auth.login.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">{t("auth.login.subtitle")}</p>
      </div>

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

      <div className="flex items-center justify-between gap-3">
        <Controller
          name="rememberMe"
          control={control}
          render={({ field }) => (
            <AppCheckBox
              className="w-1/2"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
            >
              {t("auth.login.rememberMe")}
            </AppCheckBox>
          )}
        />

        <Link
          to={AUTH_ROUTES.forgotPassword}
          className="text-sm w-1/2 text-(--Grey700) underline underline-offset-4"
        >
          {t("auth.login.forgotPassword")}
        </Link>
      </div>

      <AppButton htmlType="submit" variant="primary" block>
        {t("auth.login.submit")}
      </AppButton>

      <p className="text-center text-sm text-(--Grey600)">
        {t("auth.login.noAccount")}{" "}
        <Link
          to={AUTH_ROUTES.signup}
          className="font-medium text-(--naturalBlack) underline underline-offset-4"
        >
          {t("auth.login.signupLink")}
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
