import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppFormFields, AppPhoneInput } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { useChangePhoneManager } from "../hooks/useChangePhoneManager";



const ChangePhoneForm = ({ currentPhoneNumber }: { currentPhoneNumber: string }) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { control, handleSubmit, onSubmit, isPending, canSubmit } =
    useChangePhoneManager(currentPhoneNumber);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <AppFormFields>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field, fieldState }) => (
            <AppPhoneInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              inputProps={{ autoComplete: "tel" }}
              label={t("user.profile.phoneNumberLabel")}
              placeholder={t("user.profile.phoneNumberPlaceholder")}
              required
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </AppFormFields>

      <AppButton
        htmlType="submit"
        variant="primary"
        loading={isPending}
        disabled={!canSubmit}
      >
        {t("user.profile.changePhone")}
      </AppButton>
    </form>
  );
};

export default ChangePhoneForm;
