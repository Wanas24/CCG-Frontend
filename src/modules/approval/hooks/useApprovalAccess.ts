import { useMemo } from "react";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessApproval } from "../utils/approvalAccess";

export const useApprovalAccess = () => {
  const { permissions, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessApproval({ granted });
  }, [isLoading, permissions]);

  return { isLoading, canOpen };
};
