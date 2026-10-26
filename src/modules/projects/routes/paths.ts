import {
  PROJECT_WORKSPACE_DEFAULT_SECTION,
  type TProjectWorkspaceSection,
} from "../constants/workspaceSections";

export const PROJECTS_ROUTES = {
  root: "/projects",
  detail: "/projects/:projectId",
  section: "/projects/:projectId/:section",
} as const;

export const projectWorkspacePath = (
  projectId: string | number,
  section: TProjectWorkspaceSection = PROJECT_WORKSPACE_DEFAULT_SECTION,
) => `/projects/${projectId}/${section}`;
