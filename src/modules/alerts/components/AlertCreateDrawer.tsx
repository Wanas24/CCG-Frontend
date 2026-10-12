import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppButton, AppDrawer } from "@/shared/ANTD_UIComponents";
import type { AlertFormValues } from "../schemas/alertFormSchema";
import type { TAlertEntityContext } from "../types";
import AlertForm from "./AlertForm";

type Props = {
  open: boolean;
  form: UseFormReturn<AlertFormValues>;
  loading?: boolean;
  entityType?: TAlertEntityContext["entityType"];
  entityId?: TAlertEntityContext["entityId"];
  projectId?: TAlertEntityContext["projectId"];
  onSubmit: (
    entityContext?: TAlertEntityContext,
  ) => (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const AlertCreateDrawer = ({
  open,
  form,
  loading,
  entityType,
  entityId,
  projectId,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  const entityContext: TAlertEntityContext | undefined =
    entityType !== undefined ||
    entityId !== undefined ||
    projectId !== undefined
      ? { entityType, entityId, projectId }
      : undefined;

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={480}
      title={t("alerts.form.title")}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <AppButton variant="secondary" htmlType="button" onClick={onClose}>
            {t("alerts.form.cancel")}
          </AppButton>
          <AppButton htmlType="submit" form="alert-form" loading={loading}>
            {t("alerts.form.submit")}
          </AppButton>
        </div>
      }
    >
      <p className="m-0 mb-4 text-sm text-(--Grey600)">
        {t("alerts.form.subtitle")}
      </p>
      <AlertForm
        form={form}
        formId="alert-form"
        enabled={open}
        entityType={entityType}
        entityId={entityId}
        projectId={projectId}
        onSubmit={onSubmit(entityContext)}
      />
    </AppDrawer>
  );
};

export default AlertCreateDrawer;
