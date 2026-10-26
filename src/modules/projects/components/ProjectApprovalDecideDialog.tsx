import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { ApprovalDecision } from "@/modules/approval/types";
import { AppButton, AppDialog, AppTextArea } from "@/shared/ANTD_UIComponents";
import type { ProjectApprovalDecideState } from "../hooks/useProjectApprovalsManager";

type Props = {
  decideState: ProjectApprovalDecideState | null;
  comment: string;
  loading?: boolean;
  onCommentChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

const ProjectApprovalDecideDialog = ({
  decideState,
  comment,
  loading,
  onCommentChange,
  onConfirm,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const open = Boolean(decideState);
  const isApprove = decideState?.decision === ApprovalDecision.Approve;

  return (
    <AppDialog
      open={open}
      title={
        isApprove
          ? t("projects.approvals.decideTitleApprove")
          : t("projects.approvals.decideTitleDecline")
      }
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <AppButton variant="secondary" disabled={loading} onClick={onClose}>
            {t("projects.approvals.cancel")}
          </AppButton>
          <AppButton
            danger={!isApprove}
            loading={loading}
            onClick={onConfirm}
          >
            {isApprove
              ? t("projects.approvals.approve")
              : t("projects.approvals.decline")}
          </AppButton>
        </div>
      }
      destroyOnHidden
    >
      <div className="flex flex-col gap-3">
        <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
          {isApprove
            ? t("projects.approvals.decideApproveHint")
            : t("projects.approvals.decideDeclineHint")}
        </p>
        <AppTextArea
          label={t("projects.approvals.comment")}
          placeholder={t("projects.approvals.commentPlaceholder")}
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          rows={3}
        />
      </div>
    </AppDialog>
  );
};

export default ProjectApprovalDecideDialog;
