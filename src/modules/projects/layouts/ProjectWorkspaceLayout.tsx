import { Navigate, Outlet, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useGetProject } from "../api/hooks/useGetProject";
import ProjectDeleteDialog from "../components/ProjectDeleteDialog";
import ProjectWorkspaceHeader from "../components/ProjectWorkspaceHeader";
import ProjectWorkspaceNav from "../components/ProjectWorkspaceNav";
import { useDeleteProjectManager } from "../hooks/useDeleteProjectManager";
import { useProjectsAccess } from "../hooks/useProjectsAccess";
import { PROJECTS_ROUTES } from "../routes/paths";
import type { TProjectWorkspaceOutletContext } from "../types/workspaceOutlet";
import { parseProjectRouteId } from "../utils/parseProjectRouteId";

const ProjectWorkspaceLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId: projectIdParam } = useParams();
  const projectId = parseProjectRouteId(projectIdParam);
  const { isLoading: accessLoading, canOpen } = useProjectsAccess();
  const deleteManager = useDeleteProjectManager();
  const projectQuery = useGetProject(projectId, canOpen && projectId != null);

  if (accessLoading) {
    return (
      <div className="flex flex-col gap-3">
        <AppSkeleton.Input active className="!h-8 !w-48 !min-w-48" />
        <p className={DesignTokens.typography.muted}>
          {t("projects.workspace.loading")}
        </p>
      </div>
    );
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  if (projectId == null) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer error={t("projects.workspace.invalidId")} />
        <AppButton
          variant="secondary"
          className="w-fit!"
          onClick={() => navigate(PROJECTS_ROUTES.root)}
        >
          {t("projects.workspace.back")}
        </AppButton>
      </div>
    );
  }

  const response = projectQuery.data;
  const project =
    response?.isSuccess && response.data?.data?.length
      ? (response.data.data.find((item) => item.id === projectId) ??
        response.data.data[0] ??
        null)
      : null;
  const matched =
    project != null && Number(project.id) === Number(projectId) ? project : null;

  if (projectQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-5">
          <AppSkeleton.Input active className="!mb-3 !h-8 !w-20 !min-w-20" />
          <AppSkeleton.Input active className="!mb-2 !h-8 !w-64 !min-w-48" />
          <AppSkeleton.Input active className="!h-4 !w-48 !min-w-40" />
        </div>
        <p className={DesignTokens.typography.muted}>
          {t("projects.workspace.loading")}
        </p>
      </div>
    );
  }

  if (projectQuery.isError || (response && !response.isSuccess)) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer
          error={response?.message ?? t("projects.workspace.loadError")}
        />
        <div className="flex flex-wrap gap-2">
          <AppButton
            variant="secondary"
            loading={projectQuery.isFetching}
            onClick={() => {
              void projectQuery.refetch();
            }}
            className="w-fit!"
          >
            {t("projects.retry")}
          </AppButton>
          <AppButton
            variant="secondary"
            className="w-fit!"
            onClick={() => navigate(PROJECTS_ROUTES.root)}
          >
            {t("projects.workspace.back")}
          </AppButton>
        </div>
      </div>
    );
  }

  if (!matched) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer error={t("projects.workspace.notFound")} />
        <AppButton
          variant="secondary"
          className="w-fit!"
          onClick={() => navigate(PROJECTS_ROUTES.root)}
        >
          {t("projects.workspace.back")}
        </AppButton>
      </div>
    );
  }

  const outletContext: TProjectWorkspaceOutletContext = { project: matched };

  return (
    <div className="flex flex-col gap-4">
      <ProjectWorkspaceHeader
        project={matched}
        canDelete={deleteManager.canDelete}
        onDelete={() => deleteManager.openDelete(matched)}
      />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <ProjectWorkspaceNav projectId={projectId} />
        <section className="min-h-64 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 sm:p-5">
          <Outlet context={outletContext} />
        </section>
      </div>
      <ProjectDeleteDialog
        project={deleteManager.deletingProject}
        loading={deleteManager.isDeleting}
        onConfirm={() => {
          void deleteManager.confirmDelete();
        }}
        onClose={deleteManager.closeDelete}
      />
    </div>
  );
};

export default ProjectWorkspaceLayout;
