import type { BaseSyntheticEvent } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AppButton,
  AppDialog,
  AppDrawer,
  AppInput,
  AppTextArea,
} from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import type { MeasurementFormValues } from "../schemas/measurementFormSchema";
import type { TMeasurement } from "../types/measurement";

type FormDrawerProps = {
  open: boolean;
  form: UseFormReturn<MeasurementFormValues>;
  editingUnit: TMeasurement | null;
  loading?: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

export const UnitFormDrawer = ({
  open,
  form,
  editingUnit,
  loading,
  onSubmit,
  onClose,
}: FormDrawerProps) => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const isEditing = Boolean(editingUnit);

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={480}
      title={
        isEditing
          ? t("lists.units.editTitle")
          : t("lists.units.composerTitle")
      }
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <AppButton variant="secondary" htmlType="button" onClick={onClose}>
            {t("lists.common.cancel")}
          </AppButton>
          <AppButton htmlType="submit" form="unit-form" loading={loading}>
            {isEditing ? t("lists.units.save") : t("lists.units.add")}
          </AppButton>
        </div>
      }
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {isEditing
          ? t("lists.units.editSubtitle")
          : t("lists.units.composerSubtitle")}
      </p>
      <form
        id="unit-form"
        className="mt-4 flex flex-col gap-3"
        onSubmit={onSubmit}
        noValidate
      >
        <Controller
          name="unit"
          control={form.control}
          render={({ field, fieldState }) => (
            <AppInput
              {...field}
              required
              label={t("lists.units.unitLabel")}
              placeholder={t("lists.units.unitPlaceholder")}
              maxLength={50}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
        <Controller
          name="details"
          control={form.control}
          render={({ field, fieldState }) => (
            <AppTextArea
              {...field}
              label={t("lists.units.detailsLabel")}
              placeholder={t("lists.units.detailsPlaceholder")}
              maxLength={500}
              rows={3}
              errorMsg={translateError(fieldState.error?.message)}
            />
          )}
        />
      </form>
    </AppDrawer>
  );
};

type DeleteProps = {
  unit: TMeasurement | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const UnitDeleteDialog = ({
  unit,
  loading,
  onConfirm,
  onClose,
}: DeleteProps) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(unit)}
      title={t("lists.units.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("lists.units.deleteConfirm", { unit: unit?.unit ?? "" })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" onClick={onClose}>
          {t("lists.common.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("lists.units.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};
