import { useMemo } from "react";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessProjects } from "../utils/projectAccess";

export const useProjectsAccess = () => {
  const { permissions, hasPermission, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessProjects({ granted });
  }, [isLoading, permissions]);

  const canCreate = !isLoading && hasPermission(PermissionsList.Project.Create);
  const canEdit = !isLoading && hasPermission(PermissionsList.Project.Edit);
  const canDelete = !isLoading && hasPermission(PermissionsList.Project.Delete);

  return { isLoading, canOpen, canCreate, canEdit, canDelete };
};
