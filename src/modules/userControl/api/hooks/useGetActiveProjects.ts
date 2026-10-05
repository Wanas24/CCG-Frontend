import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { projectEmployeeService } from "../services/projectEmployee.service";
import { activeProjectsQueryKey } from "../queryKeys/projectEmployeeQueryKeys";
import type { TGetActiveProjectsParams } from "../../types";
import { nextPagedParam, USER_CONTROL_PAGE_SIZE } from "./userControlPaging";

export const useGetActiveProjects = (
  params: TGetActiveProjectsParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const pageSize = params.pageSize ?? USER_CONTROL_PAGE_SIZE;
  const listParams = { ...params, pageSize };

  return useInfiniteQuery({
    queryKey: activeProjectsQueryKey(listParams),
    queryFn: ({ pageParam }) =>
      projectEmployeeService.projects({ ...listParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPagedParam,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
