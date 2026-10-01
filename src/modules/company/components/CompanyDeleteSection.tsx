import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog, AppInput } from "@/shared/ANTD_UIComponents";
import { useTranslatedFormError } from "@/shared/validation";
import { applyApiFieldErrors } from "@/lib/api/applyApiFieldErrors";
import {
  companyDeleteConfirmSchema,
  type CompanyDeleteConfirmValues,
} from "../schemas";
import { useDeleteCompanyManager } from "../hooks/useDeleteCompanyManager";

const CompanyDeleteSection = () => {
  const { t } = useTranslation();
  const translateError = useTranslatedFormError();
  const { deleteCompany, isPending } = useDeleteCompanyManager();
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, reset, setError } =
    useForm<CompanyDeleteConfirmValues>({
      resolver: zodResolver(companyDeleteConfirmSchema),
      defaultValues: {
        password: "",
      },
    });

  useEffect(() => {
    if (!open) {
      reset({ password: "" });
    }
  }, [open, reset]);

  const closeDialog = () => {
    if (isPending) {
      return;
    }

    reset({ password: "" });
    setOpen(false);
  };

  const onConfirm = handleSubmit(async ({ password }) => {
    const result = await deleteCompany(password);

    if (result.ok) {
      reset({ password: "" });
      setOpen(false);
      return;
    }

    if (result.reason === "password") {
      applyApiFieldErrors(setError, result.response.data);
      setError("password", {
        type: "server",
        message:
          typeof result.response.message === "string" &&
          result.response.message.length > 0
            ? result.response.message
            : t("company.delete.passwordInvalid"),
      });
      return;
    }

    reset({ password: "" });
  });

  return (
    <>
      <AppButton
        variant="delete"
        loading={isPending}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        {t("company.delete.action")}
      </AppButton>

      <AppDialog
        open={open}
        title={t("company.delete.confirmTitle")}
        onCancel={closeDialog}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton
              variant="tertiary"
              disabled={isPending}
              onClick={closeDialog}
            >
              {t("common.cancel")}
            </AppButton>
            <AppButton
              variant="delete"
              htmlType="submit"
              form="company-delete-confirm-form"
              loading={isPending}
              disabled={isPending}
            >
              {t("company.delete.action")}
            </AppButton>
          </div>
        }
      >
        <form
          id="company-delete-confirm-form"
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void onConfirm();
          }}
          noValidate
        >
          <p className="m-0 text-sm text-(--app-text)">
            {t("company.delete.confirmMessage")}
          </p>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                type="password"
                autoComplete="current-password"
                label={t("company.delete.passwordLabel")}
                placeholder={t("company.delete.passwordPlaceholder")}
                required
                disabled={isPending}
                errorMsg={translateError(fieldState.error?.message)}
              />
            )}
          />
        </form>
      </AppDialog>
    </>
  );
};

export default CompanyDeleteSection;
