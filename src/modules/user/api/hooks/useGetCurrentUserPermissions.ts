import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { userService } from "../services/user.service";
import { permissionsQueryKey } from "./permissionsQueryKey";
import type { TGetCurrentUserPermissionsResponse } from "../../types";

export const useGetCurrentUserPermissions = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetCurrentUserPermissionsResponse>({
    queryKey: permissionsQueryKey,
    queryFn: userService.getCurrentUserPermissions,
    enabled: isAuthenticated && companyId !== null,
  });
};
