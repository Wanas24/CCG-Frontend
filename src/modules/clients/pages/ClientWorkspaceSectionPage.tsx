import { Navigate, useOutletContext, useParams } from "react-router";
import ClientFilesPanel from "../components/ClientFilesPanel";
import ClientOverviewPanel from "../components/ClientOverviewPanel";
import {
  CLIENT_WORKSPACE_DEFAULT_SECTION,
  isClientWorkspaceSection,
} from "../constants/workspaceSections";
import { CLIENTS_ROUTES, clientWorkspacePath } from "../routes/paths";
import type { TClientWorkspaceOutletContext } from "../types/workspaceOutlet";
import { parseClientRouteId } from "../utils/parseClientRouteId";

const ClientWorkspaceSectionPage = () => {
  const { clientId: clientIdParam, section } = useParams();
  const clientId = parseClientRouteId(clientIdParam);
  const { client } = useOutletContext<TClientWorkspaceOutletContext>();

  if (clientId == null) {
    return <Navigate to={CLIENTS_ROUTES.root} replace />;
  }

  if (!isClientWorkspaceSection(section)) {
    return (
      <Navigate
        to={clientWorkspacePath(clientId, CLIENT_WORKSPACE_DEFAULT_SECTION)}
        replace
      />
    );
  }

  if (section === "overview") {
    return <ClientOverviewPanel key={client.id} client={client} />;
  }

  if (section === "files") {
    return <ClientFilesPanel key={clientId} clientId={clientId} />;
  }

  return (
    <Navigate
      to={clientWorkspacePath(clientId, CLIENT_WORKSPACE_DEFAULT_SECTION)}
      replace
    />
  );
};

export default ClientWorkspaceSectionPage;
