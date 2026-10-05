import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import ApprovalStudioView from "../components/ApprovalStudioView";
import { useApprovalAccess } from "../hooks/useApprovalAccess";
import { useApprovalStudio } from "../hooks/useApprovalStudio";

const ApprovalContent = () => {
  const studio = useApprovalStudio();
  return <ApprovalStudioView studio={studio} />;
};

const ApprovalPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen } = useApprovalAccess();

  if (isLoading) {
    return <p className={DesignTokens.typography.muted}>{t("common.loading")}</p>;
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <ApprovalContent />;
};

export default ApprovalPage;
