import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppCheckBox,
  AppDropDownSelect,
  AppInput,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "../constants/projectList";
import type { ProjectFormValues } from "../schemas/projectFormSchema";
import {
  projectStatusLabelKey,
  projectTypeLabelKey,
} from "../utils/projectLabels";
import ClientSelect from "./ClientSelect";

type Props = {
  control: Control<ProjectFormValues>;
  disabled?: boolean;
  selectedClientLabel?: string | null;
  onClientLabelChange?: (label?: string) => void;
  showIsActive?: boolean;
};

const ProjectFormFields = ({
  control,
  disabled = false,
  selectedClientLabel,
  onClientLabelChange,
  showIsActive = false,
}: Props) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();

  const statusOptions = PROJECT_STATUS_OPTIONS.map((value) => ({
    value,
    label: t(projectStatusLabelKey(value) ?? "projects.filters.anyStatus"),
  }));
  const typeOptions = PROJECT_TYPE_OPTIONS.map((value) => ({
    value,
    label: t(projectTypeLabelKey(value) ?? "projects.filters.anyType"),
  }));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            required
            disabled={disabled}
            label={t("projects.form.name")}
            placeholder={t("projects.form.namePlaceholder")}
            maxLength={200}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="number"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.number")}
            placeholder={t("projects.form.numberPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="officialName"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.officialName")}
            placeholder={t("projects.form.officialNamePlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="clientId"
        control={control}
        render={({ field, fieldState }) => (
          <ClientSelect
            value={field.value}
            selectedLabel={selectedClientLabel}
            required
            disabled={disabled}
            label={t("projects.form.client")}
            placeholder={t("projects.form.clientPlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
            onChange={(clientId, label) => {
              field.onChange(clientId ?? 0);
              onClientLabelChange?.(label);
            }}
          />
        )}
      />
      <Controller
        name="projectType"
        control={control}
        render={({ field, fieldState }) => (
          <AppDropDownSelect
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            required
            options={typeOptions}
            label={t("projects.form.projectType")}
            placeholder={t("projects.form.projectTypePlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="status"
        control={control}
        render={({ field, fieldState }) => (
          <AppDropDownSelect
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            required
            options={statusOptions}
            label={t("projects.form.status")}
            placeholder={t("projects.form.statusPlaceholder")}
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
              rows={3}
              maxLength={1000}
              label={t("projects.form.notes")}
              placeholder={t("projects.form.notesPlaceholder")}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </div>
      <Controller
        name="taxIncluded"
        control={control}
        render={({ field }) => (
          <AppCheckBox
            checked={field.value}
            disabled={disabled}
            onChange={(event) => field.onChange(event.target.checked)}
          >
            {t("projects.form.taxIncluded")}
          </AppCheckBox>
        )}
      />
      <Controller
        name="hasDemolisionLicence"
        control={control}
        render={({ field }) => (
          <AppCheckBox
            checked={field.value}
            disabled={disabled}
            onChange={(event) => field.onChange(event.target.checked)}
          >
            {t("projects.form.hasDemolisionLicence")}
          </AppCheckBox>
        )}
      />
      <Controller
        name="hasCivilDefenseLicence"
        control={control}
        render={({ field }) => (
          <AppCheckBox
            checked={field.value}
            disabled={disabled}
            onChange={(event) => field.onChange(event.target.checked)}
          >
            {t("projects.form.hasCivilDefenseLicence")}
          </AppCheckBox>
        )}
      />
      {showIsActive ? (
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <AppCheckBox
              checked={field.value}
              disabled={disabled}
              onChange={(event) => field.onChange(event.target.checked)}
            >
              {t("projects.form.isActive")}
            </AppCheckBox>
          )}
        />
      ) : null}
      <Controller
        name="country"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.country")}
            placeholder={t("projects.form.countryPlaceholder")}
            maxLength={500}
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
            label={t("projects.form.city")}
            placeholder={t("projects.form.cityPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="district"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.district")}
            placeholder={t("projects.form.districtPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="street"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.street")}
            placeholder={t("projects.form.streetPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="buildingNumber"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.buildingNumber")}
            placeholder={t("projects.form.buildingNumberPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="postalCode"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.postalCode")}
            placeholder={t("projects.form.postalCodePlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="latitude"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.latitude")}
            placeholder={t("projects.form.latitudePlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="longitude"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.longitude")}
            placeholder={t("projects.form.longitudePlaceholder")}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <Controller
        name="landmark"
        control={control}
        render={({ field, fieldState }) => (
          <AppInput
            {...field}
            disabled={disabled}
            label={t("projects.form.landmark")}
            placeholder={t("projects.form.landmarkPlaceholder")}
            maxLength={500}
            errorMsg={translateError(fieldState.error?.message)}
          />
        )}
      />
      <div className="sm:col-span-2">
        <Controller
          name="locationNotes"
          control={control}
          render={({ field, fieldState }) => (
            <AppTextArea
              {...field}
              disabled={disabled}
              rows={2}
              maxLength={500}
              label={t("projects.form.locationNotes")}
              placeholder={t("projects.form.locationNotesPlaceholder")}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProjectFormFields;
