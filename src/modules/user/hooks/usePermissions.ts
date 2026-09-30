import { useCallback, useMemo } from "react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetCurrentUserPermissions } from "../api/hooks/useGetCurrentUserPermissions";
import type { TPermission } from "../types";

const emptyPermissions: TPermission[] = [];

export const usePermissions = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const query = useGetCurrentUserPermissions();
  const current = query.data?.isSuccess ? query.data.data : undefined;

  const permissions = current?.permissions ?? emptyPermissions;
  const isAdmin = current?.isAdmin ?? false;
  const isManager = current?.isManager ?? false;

  const grantedNames = useMemo(
    () => new Set(permissions.map((permission) => permission.name)),
    [permissions],
  );

  const hasPermission = useCallback(
    (permission: string) => {
      if (!isAuthenticated || query.isPending || !query.data?.isSuccess) {
        return false;
      }

      return grantedNames.has(permission);
    },
    [grantedNames, isAuthenticated, query.data?.isSuccess, query.isPending],
  );

  return {
    permissions,
    isAdmin,
    isManager,
    hasPermission,
    isLoading: isAuthenticated && query.isPending,
    isError: query.isError || Boolean(query.data && !query.data.isSuccess),
  };
};
