import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  AppButton,
  AppDatePicker,
  AppFormFields,
  AppInput,
  AppPhoneInput,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { useProfileManager } from "../hooks/useProfileManager";
import type { TUserInfo } from "../types";

type Props = {
  profile: TUserInfo;
};

const ProfileForm = ({ profile }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { control, handleSubmit, onSubmit, isPending } =
    useProfileManager(profile);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <AppFormFields>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                autoComplete="given-name"
                label={t("user.profile.firstNameLabel")}
                placeholder={t("user.profile.firstNamePlaceholder")}
                required
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                autoComplete="family-name"
                label={t("user.profile.lastNameLabel")}
                placeholder={t("user.profile.lastNamePlaceholder")}
                required
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </div>

        <Controller
          name="extraPhone"
          control={control}
          render={({ field, fieldState }) => (
            <AppPhoneInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              label={t("user.profile.extraPhoneLabel")}
              placeholder={t("user.profile.extraPhonePlaceholder")}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="nationalId"
          control={control}
          render={({ field, fieldState }) => (
            <AppInput
              {...field}
              label={t("user.profile.nationalIdLabel")}
              placeholder={t("user.profile.nationalIdPlaceholder")}
              required
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field, fieldState }) => (
            <AppDatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) =>
                field.onChange(
                  dayjs.isDayjs(date) ? date.format("YYYY-MM-DD") : "",
                )
              }
              label={t("user.profile.dateOfBirthLabel")}
              placeholder={t("user.profile.dateOfBirthPlaceholder")}
              required
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />

        <Controller
          name="fullAddress"
          control={control}
          render={({ field, fieldState }) => (
            <AppTextArea
              {...field}
              autoComplete="street-address"
              label={t("user.profile.fullAddressLabel")}
              placeholder={t("user.profile.fullAddressPlaceholder")}
              required
              rows={3}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </AppFormFields>

      <AppButton htmlType="submit" variant="primary" loading={isPending}>
        {t("user.profile.save")}
      </AppButton>
    </form>
  );
};

export default ProfileForm;
