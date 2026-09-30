import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { userService } from "../services/user.service";

export const permissionsQueryKey = ["user", "permissions"] as const;

export const refreshPermissions = async () => {
  await queryClient.cancelQueries({ queryKey: permissionsQueryKey });
  queryClient.removeQueries({ queryKey: permissionsQueryKey });

  if (!useAuthStore.getState().isAuthenticated) {
    return;
  }

  if (useAuthStore.getState().user?.companyId == null) {
    return;
  }

  await queryClient.fetchQuery({
    queryKey: permissionsQueryKey,
    queryFn: userService.getCurrentUserPermissions,
  });
};
