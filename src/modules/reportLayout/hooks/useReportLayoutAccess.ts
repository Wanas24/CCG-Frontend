import { useMemo } from "react";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessReportLayouts } from "../utils/reportLayoutAccess";

export const useReportLayoutAccess = () => {
  const { permissions, isAdmin, isManager, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessReportLayouts({ isAdmin, isManager, granted });
  }, [isAdmin, isLoading, isManager, permissions]);

  return { isLoading, canOpen };
};
