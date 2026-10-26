import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TClientFile } from "../types/clientFile";

type Props = {
  file: TClientFile | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ClientFileDeleteDialog = ({
  file,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(file)}
      title={t("clients.files.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("clients.files.deleteConfirm", {
          name: file?.fileName ?? "",
        })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("clients.files.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("clients.files.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ClientFileDeleteDialog;
