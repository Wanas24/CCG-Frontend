import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppInput, AppTextArea } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { ClientFormValues } from "../schemas/clientFormSchema";

type Props = {
  control: Control<ClientFormValues>;
  disabled?: boolean;
};

const ClientFormFields = ({ control, disabled = false }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            required
            label={t("clients.form.name")}
            placeholder={t("clients.form.namePlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            type="email"
            label={t("clients.form.email")}
            placeholder={t("clients.form.emailPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.phone")}
            placeholder={t("clients.form.phonePlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="contactPerson"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.contactPerson")}
            placeholder={t("clients.form.contactPersonPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="taxNumber"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.taxNumber")}
            placeholder={t("clients.form.taxNumberPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.country")}
            placeholder={t("clients.form.countryPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.city")}
            placeholder={t("clients.form.cityPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("clients.form.address")}
            placeholder={t("clients.form.addressPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <div className="sm:col-span-2">
        <Controller
          name="notes"
          control={control}
          render={({ field, fieldState }) => (
            <AppTextArea
              {...field}
              disabled={disabled}
              label={t("clients.form.notes")}
              placeholder={t("clients.form.notesPlaceholder")}
              rows={3}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ClientFormFields;
