import { Construction } from "lucide-react";
import { Navigate, useOutletContext, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import ProjectAlertsPanel from "../components/ProjectAlertsPanel";
import ProjectFilesPanel from "../components/ProjectFilesPanel";
import ProjectOverviewPanel from "../components/ProjectOverviewPanel";
import ProjectTeamPanel from "../components/ProjectTeamPanel";
import {
  isProjectWorkspaceReadySection,
  isProjectWorkspaceSection,
  PROJECT_WORKSPACE_DEFAULT_SECTION,
} from "../constants/workspaceSections";
import { PROJECTS_ROUTES, projectWorkspacePath } from "../routes/paths";
import type { TProjectWorkspaceOutletContext } from "../types/workspaceOutlet";
import { parseProjectRouteId } from "../utils/parseProjectRouteId";

const ProjectWorkspaceSectionPage = () => {
  const { t } = useTranslation();
  const { projectId: projectIdParam, section } = useParams();
  const projectId = parseProjectRouteId(projectIdParam);
  const { project } = useOutletContext<TProjectWorkspaceOutletContext>();

  if (projectId == null) {
    return <Navigate to={PROJECTS_ROUTES.root} replace />;
  }

  if (!isProjectWorkspaceSection(section)) {
    return (
      <Navigate
        to={projectWorkspacePath(projectId, PROJECT_WORKSPACE_DEFAULT_SECTION)}
        replace
      />
    );
  }

  if (section === "overview") {
    return <ProjectOverviewPanel key={project.id} project={project} />;
  }

  if (section === "files") {
    return <ProjectFilesPanel key={projectId} projectId={projectId} />;
  }

  if (section === "team") {
    return <ProjectTeamPanel key={project.id} project={project} />;
  }

  if (section === "alerts") {
    return <ProjectAlertsPanel key={project.id} project={project} />;
  }

  const ready = isProjectWorkspaceReadySection(section);
  const title = t(`projects.workspace.sections.${section}`);

  return (
    <AppEmptyState
      icon={<Construction size={DesignTokens.media.iconMd} />}
      title={title}
      description={
        ready
          ? t("projects.workspace.placeholder.ready", { section: title })
          : t("projects.workspace.placeholder.soon", { section: title })
      }
    />
  );
};

export default ProjectWorkspaceSectionPage;
