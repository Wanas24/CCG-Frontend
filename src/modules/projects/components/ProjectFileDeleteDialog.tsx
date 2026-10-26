import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TProjectFile } from "../types/projectFile";

type Props = {
  file: TProjectFile | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ProjectFileDeleteDialog = ({
  file,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(file)}
      title={t("projects.files.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("projects.files.deleteConfirm", {
          name: file?.fileName ?? "",
        })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("projects.files.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("projects.files.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ProjectFileDeleteDialog;
