import { Construction, Layers } from "lucide-react";
import { Navigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import {
  isProjectWorkspaceReadySection,
  isProjectWorkspaceSection,
  PROJECT_WORKSPACE_DEFAULT_SECTION,
} from "../constants/workspaceSections";
import { PROJECTS_ROUTES, projectWorkspacePath } from "../routes/paths";
import { parseProjectRouteId } from "../utils/parseProjectRouteId";

const ProjectWorkspaceSectionPage = () => {
  const { t } = useTranslation();
  const { projectId: projectIdParam, section } = useParams();
  const projectId = parseProjectRouteId(projectIdParam);

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

  const ready = isProjectWorkspaceReadySection(section);
  const title = t(`projects.workspace.sections.${section}`);

  return (
    <AppEmptyState
      icon={
        ready ? (
          <Layers size={DesignTokens.media.iconMd} />
        ) : (
          <Construction size={DesignTokens.media.iconMd} />
        )
      }
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
