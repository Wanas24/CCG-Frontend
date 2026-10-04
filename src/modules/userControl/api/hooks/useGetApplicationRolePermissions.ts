import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { applicationRoleService } from "../services/applicationRole.service";
import { applicationRolePermissionsQueryKey } from "../queryKeys/applicationRoleQueryKeys";
import type { TGetApplicationRolePermissionsParams } from "../../types";
import { nextPagedParam, USER_CONTROL_PAGE_SIZE } from "./userControlPaging";

export const useGetApplicationRolePermissions = (
  params: TGetApplicationRolePermissionsParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const pageSize = params.pageSize ?? USER_CONTROL_PAGE_SIZE;
  const listParams = { ...params, pageSize };

  return useInfiniteQuery({
    queryKey: applicationRolePermissionsQueryKey(listParams),
    queryFn: ({ pageParam }) =>
      applicationRoleService.getPermissions({ ...listParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPagedParam,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
