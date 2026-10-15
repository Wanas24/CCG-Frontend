import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppDrawer, AppSkeleton } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import type { ClientFormValues } from "../schemas/clientFormSchema";
import ClientFormFields from "./ClientFormFields";

type Props = {
  open: boolean;
  form: UseFormReturn<ClientFormValues>;
  formId: string;
  title: string;
  subtitle: string;
  submitLabel: string;
  loading?: boolean;
  detailsLoading?: boolean;
  detailsError?: string | null;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const ClientFormDrawer = ({
  open,
  form,
  formId,
  title,
  subtitle,
  submitLabel,
  loading,
  detailsLoading,
  detailsError,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const busy = Boolean(loading || detailsLoading);
  const canSubmit = !busy && !detailsError && !detailsLoading;

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={640}
      title={title}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <AppButton
            variant="secondary"
            htmlType="button"
            disabled={loading}
            onClick={onClose}
          >
            {t("clients.form.cancel")}
          </AppButton>
          <AppButton
            htmlType="submit"
            form={formId}
            loading={loading}
            disabled={!canSubmit}
          >
            {submitLabel}
          </AppButton>
        </div>
      }
    >
      <p className={`m-0 mb-4 ${DesignTokens.typography.muted}`}>{subtitle}</p>
      {detailsLoading ? (
        <div className="flex flex-col gap-3">
          <AppSkeleton.Input active className="!h-10 !w-full" />
          <AppSkeleton.Input active className="!h-10 !w-full" />
          <AppSkeleton.Input active className="!h-10 !w-full" />
        </div>
      ) : detailsError ? (
        <AppErrorContainer error={detailsError} />
      ) : (
        <form id={formId} onSubmit={onSubmit} noValidate>
          <ClientFormFields control={form.control} disabled={busy} />
        </form>
      )}
    </AppDrawer>
  );
};

export default ClientFormDrawer;
