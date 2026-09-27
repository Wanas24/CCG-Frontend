import { queryClient } from "@/lib/queryClient";

export const permissionsQueryKey = ["user", "permissions"] as const;

export const refreshPermissions = () =>
  queryClient.invalidateQueries({ queryKey: permissionsQueryKey });
