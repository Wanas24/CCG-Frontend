import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppDrawer } from "@/shared/ANTD_UIComponents";
import type { ClientFormValues } from "../schemas/clientFormSchema";
import ClientFormFields from "./ClientFormFields";

type Props = {
  open: boolean;
  form: UseFormReturn<ClientFormValues>;
  loading?: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const CreateClientDrawer = ({
  open,
  form,
  loading,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      width={640}
      title={t("clients.form.createTitle")}
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
            form="create-client-form"
            loading={loading}
          >
            {t("clients.form.create")}
          </AppButton>
        </div>
      }
    >
      <p className={`m-0 mb-4 ${DesignTokens.typography.muted}`}>
        {t("clients.form.createSubtitle")}
      </p>
      <form id="create-client-form" onSubmit={onSubmit} noValidate>
        <ClientFormFields control={form.control} disabled={loading} />
      </form>
    </AppDrawer>
  );
};

export default CreateClientDrawer;
