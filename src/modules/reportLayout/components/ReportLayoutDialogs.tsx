import { useMemo, useRef, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { AppButton, AppDialog, AppInput } from "@/shared/ANTD_UIComponents";
import type { ReportLayoutStudioApi } from "../hooks/useReportLayoutStudio";
import {
  createLayoutSaveSchema,
  type TLayoutSaveValues,
} from "../schemas/layoutIdentitySchema";
import { LAYOUT_LIMITS } from "../schemas/layoutLimits";
import { companyLayouts } from "../utils/layoutPayload";

type Props = {
  studio: ReportLayoutStudioApi;
};

const SAVE_FORM_ID = "report-layout-save";

const ReportLayoutDialogs = ({ studio }: Props) => {
  const { t } = useTranslation();
  const [blockedMessages, setBlockedMessages] = useState<string[]>([]);
  const takenCodes = useMemo(() => {
    const codes = new Map<string, string>();
    companyLayouts(studio.layouts).forEach((layout) => {
      codes.set(layout.code, layout.name);
    });
    return codes;
  }, [studio.layouts]);
  const schema = useMemo(
    () => createLayoutSaveSchema(t, takenCodes),
    [t, takenCodes],
  );
  const schemaRef = useRef(schema);
  schemaRef.current = schema;
  const resolver = useRef<Resolver<TLayoutSaveValues>>((values, context, options) =>
    zodResolver(schemaRef.current)(values, context, options),
  ).current;
  const { control, handleSubmit, reset, setError } = useForm<TLayoutSaveValues>({
    resolver,
    defaultValues: {
      code: "",
      name: "",
      isDefault: false,
    },
  });

  const onSubmit = (values: TLayoutSaveValues) => {
    const result = studio.submitSave(values);
    if (result.fields.code) setError("code", { message: result.fields.code });
    if (result.fields.name) setError("name", { message: result.fields.name });
    setBlockedMessages(result.messages);
  };

  return (
    <>
      <AppDialog
        open={studio.saveDraft !== null}
        title={t("reportLayout.save.title")}
        onCancel={studio.closeSave}
        destroyOnHidden
        afterOpenChange={(open) => {
          if (!open || !studio.saveDraft) return;
          reset(studio.saveDraft);
          setBlockedMessages([]);
        }}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={studio.closeSave}>
              {t("reportLayout.save.cancel")}
            </AppButton>
            <AppButton htmlType="submit" form={SAVE_FORM_ID} loading={studio.isSaving}>
              {t("reportLayout.save.submit")}
            </AppButton>
          </div>
        }
      >
        <form
          id={SAVE_FORM_ID}
          onSubmit={handleSubmit(onSubmit, () => setBlockedMessages([]))}
        >
          <p className="mb-4 text-sm text-(--Grey600)">{t("reportLayout.save.hint")}</p>
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                className="mb-3"
                label={t("reportLayout.save.code")}
                required
                maxLength={LAYOUT_LIMITS.code}
                errorMsg={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <AppInput
                {...field}
                className="mb-3"
                label={t("reportLayout.save.name")}
                required
                maxLength={LAYOUT_LIMITS.name}
                errorMsg={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Switch size="small" checked={field.value} onChange={field.onChange} />
                {t("reportLayout.save.makeDefault")}
              </label>
            )}
          />
          {blockedMessages.map((message, index) => (
            <p key={`${index}-${message}`} className="mt-2 text-xs text-(--statusR200)">
              {message}
            </p>
          ))}
        </form>
      </AppDialog>

      <AppDialog
        open={studio.confirm !== null}
        title={studio.confirm?.title}
        onCancel={studio.closeConfirm}
        footer={
          <div className="flex justify-end gap-2">
            <AppButton variant="secondary" onClick={studio.closeConfirm}>
              {t("reportLayout.confirm.cancel")}
            </AppButton>
            <AppButton
              variant={studio.confirm?.danger ? "delete" : "primary"}
              className="h-10! w-fit!"
              loading={studio.isSaving}
              onClick={studio.acceptConfirm}
            >
              {studio.confirm?.confirmLabel}
            </AppButton>
          </div>
        }
      >
        <p className="text-sm text-(--Grey600)">{studio.confirm?.body}</p>
      </AppDialog>
    </>
  );
};

export default ReportLayoutDialogs;
