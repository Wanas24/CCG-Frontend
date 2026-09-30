import { useGetCurrentUserPermissions } from "../api/hooks/useGetCurrentUserPermissions";

const CurrentUserPermissions = () => {
  useGetCurrentUserPermissions();
  return null;
};

export default CurrentUserPermissions;
