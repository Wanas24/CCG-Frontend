import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import ReportLayoutStudioView from "../components/ReportLayoutStudioView";
import { useReportLayoutAccess } from "../hooks/useReportLayoutAccess";
import { useReportLayoutStudio } from "../hooks/useReportLayoutStudio";

const ReportLayoutContent = () => {
  const studio = useReportLayoutStudio();
  return <ReportLayoutStudioView studio={studio} />;
};

const ReportLayoutPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen } = useReportLayoutAccess();

  if (isLoading) {
    return <p className={DesignTokens.typography.muted}>{t("reportLayout.loading")}</p>;
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <ReportLayoutContent />;
};

export default ReportLayoutPage;
