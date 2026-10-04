import { useMemo } from "react";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessUserControl } from "../utils/userControlAccess";

export const useUserControlAccess = () => {
  const { permissions, isAdmin, isManager, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessUserControl({ isAdmin, isManager, granted });
  }, [isAdmin, isLoading, isManager, permissions]);

  return { isLoading, canOpen };
};
