import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TClient } from "../types/client";

type Props = {
  client: TClient | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ClientDeleteDialog = ({
  client,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const label =
    client?.name?.trim() || (client ? String(client.id) : "");

  return (
    <AppDialog
      open={Boolean(client)}
      title={t("clients.form.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("clients.form.deleteConfirm", { name: label })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("clients.form.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("clients.form.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ClientDeleteDialog;
