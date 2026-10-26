import { Navigate, useParams } from "react-router";
import { CLIENT_WORKSPACE_DEFAULT_SECTION } from "../constants/workspaceSections";
import { CLIENTS_ROUTES, clientWorkspacePath } from "../routes/paths";

const ClientWorkspaceIndexRedirect = () => {
  const { clientId } = useParams();
  if (!clientId) {
    return <Navigate to={CLIENTS_ROUTES.root} replace />;
  }
  return (
    <Navigate
      to={clientWorkspacePath(clientId, CLIENT_WORKSPACE_DEFAULT_SECTION)}
      replace
    />
  );
};

export default ClientWorkspaceIndexRedirect;
