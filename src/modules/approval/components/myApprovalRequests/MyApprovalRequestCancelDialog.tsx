import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { MyApprovalRequestsApi } from "../../hooks/useMyApprovalRequests";

type Props = {
  studio: MyApprovalRequestsApi;
};

const MyApprovalRequestCancelDialog = ({ studio }: Props) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={studio.cancelConfirmOpen}
      title={t("approval.myRequests.cancel.title")}
      onCancel={studio.closeCancelConfirm}
      footer={
        <div className="flex justify-end gap-2">
          <AppButton
            variant="secondary"
            disabled={studio.isCancelling}
            onClick={studio.closeCancelConfirm}
          >
            {t("approval.myRequests.cancel.keep")}
          </AppButton>
          <AppButton
            danger
            loading={studio.isCancelling}
            onClick={() => void studio.confirmCancel()}
          >
            {t("approval.myRequests.cancel.confirm")}
          </AppButton>
        </div>
      }
      destroyOnHidden
    >
      <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
        {t("approval.myRequests.cancel.hint")}
      </p>
    </AppDialog>
  );
};

export default MyApprovalRequestCancelDialog;
