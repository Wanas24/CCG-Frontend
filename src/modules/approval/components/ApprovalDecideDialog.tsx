import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppDialog, AppTextArea } from "@/shared/ANTD_UIComponents";
import { ApprovalDecision } from "../types";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import ApprovalHintIcon from "./ApprovalHintIcon";

type Props = {
  studio: ApprovalStudioApi;
};

const ApprovalDecideDialog = ({ studio }: Props) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const open = Boolean(studio.decideState);
  const isApprove =
    studio.decideState?.decision === ApprovalDecision.Approve;
  const count = studio.decideState?.requestIds.length ?? 0;

  const title =
    count > 1
      ? isApprove
        ? t("approval.requests.decideBulkApprove", { count })
        : t("approval.requests.decideBulkDecline", { count })
      : isApprove
        ? t("approval.requests.decideTitleApprove")
        : t("approval.requests.decideTitleDecline");

  const close = () => {
    setComment("");
    studio.setDecideState(null);
  };

  return (
    <AppDialog
      open={open}
      title={
        <span className="inline-flex items-center gap-1.5">
          {title}
          <ApprovalHintIcon hintKey="forceDecide" />
        </span>
      }
      onCancel={close}
      footer={
        <div className="flex justify-end gap-2">
          <AppButton variant="secondary" onClick={close}>
            {t("approval.builder.cancel")}
          </AppButton>
          <AppButton
            danger={!isApprove}
            loading={studio.isDeciding}
            onClick={() => {
              void studio.decide(comment.trim() || undefined).then(() => {
                setComment("");
              });
            }}
          >
            {isApprove
              ? t("approval.requests.approve")
              : t("approval.requests.decline")}
          </AppButton>
        </div>
      }
      destroyOnHidden
    >
      <div className="flex flex-col gap-3">
        <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
          {isApprove
            ? t("approval.requests.decideApproveHint")
            : t("approval.requests.decideDeclineHint")}
        </p>
        <AppTextArea
          label={`${t("approval.requests.comment")} ${t("approval.requests.commentHint")}`}
          placeholder={t("approval.requests.commentPlaceholder")}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
        />
      </div>
    </AppDialog>
  );
};

export default ApprovalDecideDialog;
