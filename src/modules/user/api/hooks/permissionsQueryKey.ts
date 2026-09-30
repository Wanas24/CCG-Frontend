import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { userService } from "../services/user.service";

export const permissionsQueryKey = ["user", "permissions"] as const;

export const refreshPermissions = async () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  const companyId = useAuthStore.getState().user?.companyId ?? null;

  if (!isAuthenticated || companyId == null) {
    await queryClient.cancelQueries({ queryKey: permissionsQueryKey });
    queryClient.removeQueries({ queryKey: permissionsQueryKey });
    return;
  }

  await queryClient.cancelQueries({ queryKey: permissionsQueryKey });
  await queryClient.fetchQuery({
    queryKey: permissionsQueryKey,
    queryFn: userService.getCurrentUserPermissions,
    staleTime: 0,
  });
};
