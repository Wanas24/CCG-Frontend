import { Navigate, useParams } from "react-router";
import { PROJECT_WORKSPACE_DEFAULT_SECTION } from "../constants/workspaceSections";
import { PROJECTS_ROUTES, projectWorkspacePath } from "../routes/paths";

const ProjectWorkspaceIndexRedirect = () => {
  const { projectId } = useParams();
  if (!projectId) {
    return <Navigate to={PROJECTS_ROUTES.root} replace />;
  }
  return (
    <Navigate
      to={projectWorkspacePath(projectId, PROJECT_WORKSPACE_DEFAULT_SECTION)}
      replace
    />
  );
};

export default ProjectWorkspaceIndexRedirect;
