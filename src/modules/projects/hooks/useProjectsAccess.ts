import { useMemo } from "react";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessProjects } from "../utils/projectAccess";

export const useProjectsAccess = () => {
  const { permissions, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessProjects({ granted });
  }, [isLoading, permissions]);

  return { isLoading, canOpen };
};
