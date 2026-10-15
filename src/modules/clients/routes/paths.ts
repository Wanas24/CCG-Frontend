import {
  CLIENT_WORKSPACE_DEFAULT_SECTION,
  type TClientWorkspaceSection,
} from "../constants/workspaceSections";

export const CLIENTS_ROUTES = {
  root: "/clients",
  detail: "/clients/:clientId",
  section: "/clients/:clientId/:section",
} as const;

export const clientWorkspacePath = (
  clientId: string | number,
  section: TClientWorkspaceSection = CLIENT_WORKSPACE_DEFAULT_SECTION,
) => `/clients/${clientId}/${section}`;
