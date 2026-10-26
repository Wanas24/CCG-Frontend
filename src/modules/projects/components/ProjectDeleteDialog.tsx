import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TProject } from "../types/project";

type Props = {
  project: TProject | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ProjectDeleteDialog = ({
  project,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const label =
    project?.name?.trim() ||
    project?.number?.trim() ||
    (project ? String(project.id) : "");

  return (
    <AppDialog
      open={Boolean(project)}
      title={t("projects.form.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("projects.form.deleteConfirm", { name: label })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("projects.form.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("projects.form.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ProjectDeleteDialog;
