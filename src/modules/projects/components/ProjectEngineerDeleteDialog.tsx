import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TProjectResponsibleEngineer } from "../types/projectResponsibleEngineer";

type Props = {
  engineer: TProjectResponsibleEngineer | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ProjectEngineerDeleteDialog = ({
  engineer,
  loading,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(engineer)}
      title={t("projects.team.deleteEngineerTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("projects.team.deleteEngineerConfirm", {
          name: engineer?.employeeName ?? "",
        })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" disabled={loading} onClick={onClose}>
          {t("projects.team.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("projects.team.remove")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

export default ProjectEngineerDeleteDialog;
