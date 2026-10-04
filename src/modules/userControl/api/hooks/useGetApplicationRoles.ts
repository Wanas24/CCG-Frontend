import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { applicationRoleService } from "../services/applicationRole.service";
import { applicationRolesQueryKey } from "../queryKeys/applicationRoleQueryKeys";
import type { TGetApplicationRolesParams } from "../../types";
import { nextPagedParam, USER_CONTROL_PAGE_SIZE } from "./userControlPaging";

export const useGetApplicationRoles = (
  params: TGetApplicationRolesParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const pageSize = params.pageSize ?? USER_CONTROL_PAGE_SIZE;
  const listParams = { ...params, pageSize };

  return useInfiniteQuery({
    queryKey: applicationRolesQueryKey(listParams),
    queryFn: ({ pageParam }) =>
      applicationRoleService.list({ ...listParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPagedParam,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
