import { Plus } from "lucide-react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import {
  AppButton,
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import CreateProjectDrawer from "../components/CreateProjectDrawer";
import ProjectsList from "../components/ProjectsList";
import { useCreateProjectManager } from "../hooks/useCreateProjectManager";
import { useProjectsAccess } from "../hooks/useProjectsAccess";

const ProjectsPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen, canCreate } = useProjectsAccess();
  const createManager = useCreateProjectManager();

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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className={`m-0 ${DesignTokens.typography.muted}`}>
              {t("projects.subtitle")}
            </p>
            {canCreate ? (
              <AppButton
                className="w-fit!"
                icon={<Plus size={16} />}
                onClick={createManager.openCreate}
              >
                {t("projects.form.create")}
              </AppButton>
            ) : null}
          </div>
          <ProjectsList />
        </AppFormSection>
      </AppFormPage>
      {canCreate ? (
        <CreateProjectDrawer
          open={createManager.drawerOpen}
          form={createManager.form}
          clientLabel={createManager.clientLabel}
          loading={createManager.isSaving}
          onClientLabelChange={createManager.setClientLabel}
          onSubmit={createManager.submitCreate}
          onClose={createManager.closeDrawer}
        />
      ) : null}
    </div>
  );
};

export default ProjectsPage;
