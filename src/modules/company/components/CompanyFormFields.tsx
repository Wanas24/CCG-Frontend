import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppDropDownSelect,
  AppFormFields,
  AppInput,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { CompanyFormValues } from "../schemas";
import { getTimeZoneOptions } from "../utils/timeZones";

type Props = {
  control: Control<CompanyFormValues>;
};

const CompanyFormFields = ({ control }: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const timeZoneOptions = getTimeZoneOptions().map((timeZoneId) => ({
    value: timeZoneId,
    label: timeZoneId,
  }));

  return (
    <AppFormFields>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            label={t("company.fields.name")}
            placeholder={t("company.fields.namePlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <AppTextArea
            {...field}
            label={t("company.fields.description")}
            placeholder={t("company.fields.descriptionPlaceholder")}
            rows={3}
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
            label={t("company.fields.address")}
            placeholder={t("company.fields.addressPlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />

      <Controller
        name="timeZoneId"
        control={control}
        render={({ field, fieldState }) => (
          <AppDropDownSelect
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            showSearch
            optionFilterProp="label"
            options={timeZoneOptions}
            label={t("company.fields.timeZone")}
            placeholder={t("company.fields.timeZonePlaceholder")}
            required
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
    </AppFormFields>
  );
};

export default CompanyFormFields;
