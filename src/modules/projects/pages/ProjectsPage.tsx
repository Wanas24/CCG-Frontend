import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { AppFormPage, AppFormSection, AppSkeleton } from "@/shared/ANTD_UIComponents";
import ProjectsList from "../components/ProjectsList";
import { useProjectsAccess } from "../hooks/useProjectsAccess";

const ProjectsPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen } = useProjectsAccess();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <AppSkeleton.Input active className="!h-8 !w-48 !min-w-48" />
        <p className={DesignTokens.typography.muted}>{t("projects.loading")}</p>
      </div>
    );
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return (
    <div>
      <AppFormPage title={t("projects.title")} className="min-w-0 gap-4!">
        <AppFormSection className="min-w-0 gap-4!">
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("projects.subtitle")}
          </p>
          <ProjectsList />
        </AppFormSection>
      </AppFormPage>
    </div>
  );
};

export default ProjectsPage;
