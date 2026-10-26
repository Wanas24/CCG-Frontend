import { useMemo } from "react";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessClients } from "../utils/clientAccess";

export const useClientsAccess = () => {
  const { permissions, hasPermission, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessClients({ granted });
  }, [isLoading, permissions]);

  const canCreate =
    !isLoading && hasPermission(PermissionsList.Client.Create);
  const canEdit = !isLoading && hasPermission(PermissionsList.Client.Edit);
  const canDelete =
    !isLoading && hasPermission(PermissionsList.Client.Delete);
  const canExport =
    !isLoading && hasPermission(PermissionsList.Client.Export);

  return { isLoading, canOpen, canCreate, canEdit, canDelete, canExport };
};
