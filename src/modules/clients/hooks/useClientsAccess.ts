import { useMemo } from "react";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { canAccessClients } from "../utils/clientAccess";

export const useClientsAccess = () => {
  const { permissions, isLoading } = usePermissions();

  const canOpen = useMemo(() => {
    if (isLoading) return false;
    const granted = new Set(permissions.map((permission) => permission.name));
    return canAccessClients({ granted });
  }, [isLoading, permissions]);

  return { isLoading, canOpen };
};
