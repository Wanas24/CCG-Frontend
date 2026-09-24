import dayjs from "dayjs";
import { Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppDatePicker,
  AppInput,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useTranslatedFormError } from "@/shared/validation";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { useSignupForm } from "../hooks/useSignupForm";

const SignupForm = () => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    isPending,
    isError,
    registerError,
  } = useSignupForm();

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.signup.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              autoComplete="given-name"
              label={t("auth.signup.firstNameLabel")}
              placeholder={t("auth.signup.firstNamePlaceholder")}
              required
              errorMsg={translateError(errors.firstName?.message)}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              autoComplete="family-name"
              label={t("auth.signup.lastNameLabel")}
              placeholder={t("auth.signup.lastNamePlaceholder")}
              required
              errorMsg={translateError(errors.lastName?.message)}
            />
          )}
        />
      </div>

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
            errorMsg={translateError(errors.email?.message)}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              label={t("auth.signup.confirmPasswordLabel")}
              placeholder={t("auth.signup.confirmPasswordPlaceholder")}
              required
              errorMsg={translateError(errors.confirmPassword?.message)}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              type="tel"
              autoComplete="tel"
              label={t("auth.signup.phoneNumberLabel")}
              placeholder={t("auth.signup.phoneNumberPlaceholder")}
              required
              errorMsg={translateError(errors.phoneNumber?.message)}
            />
          )}
        />

        <Controller
          name="extraPhone"
          control={control}
          render={({ field }) => (
            <AppInput
              {...field}
              type="tel"
              label={t("auth.signup.extraPhoneLabel")}
              placeholder={t("auth.signup.extraPhonePlaceholder")}
              required
              errorMsg={translateError(errors.extraPhone?.message)}
            />
          )}
        />
      </div>

      <Controller
        name="nationalId"
        control={control}
        render={({ field }) => (
          <AppInput
            {...field}
            label={t("auth.signup.nationalIdLabel")}
            placeholder={t("auth.signup.nationalIdPlaceholder")}
            required
            errorMsg={translateError(errors.nationalId?.message)}
          />
        )}
      />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <AppDatePicker
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) =>
              field.onChange(
                dayjs.isDayjs(date) ? date.toISOString() : "",
              )
            }
            label={t("auth.signup.dateOfBirthLabel")}
            placeholder={t("auth.signup.dateOfBirthPlaceholder")}
            required
            errorMsg={translateError(errors.dateOfBirth?.message)}
          />
        )}
      />

      <Controller
        name="fullAddress"
        control={control}
        render={({ field }) => (
          <AppTextArea
            {...field}
            autoComplete="street-address"
            label={t("auth.signup.fullAddressLabel")}
            placeholder={t("auth.signup.fullAddressPlaceholder")}
            required
            rows={3}
            errorMsg={translateError(errors.fullAddress?.message)}
          />
        )}
      />

      {isError && (
        <AppErrorContainer
          error={registerError?.response?.data.message || ""}
        />
      )}

      <AppButton
        htmlType="submit"
        variant="primary"
        block
        loading={isPending}
      >
        {t("auth.signup.submit")}
      </AppButton>

      <p className="text-center text-sm text-(--Grey600)">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          to={AUTH_ROUTES.login}
          className="font-medium text-(--app-text) underline underline-offset-4"
        >
          {t("auth.signup.loginLink")}
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
