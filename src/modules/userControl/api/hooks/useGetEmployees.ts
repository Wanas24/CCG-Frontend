import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { employeeService } from "../services/employee.service";
import { employeesQueryKey } from "../queryKeys/employeeQueryKeys";
import type { TGetEmployeesParams } from "../../types";
import { nextPagedParam, USER_CONTROL_PAGE_SIZE } from "./userControlPaging";

export const useGetEmployees = (
  params: TGetEmployeesParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const pageSize = params.pageSize ?? USER_CONTROL_PAGE_SIZE;
  const listParams = { ...params, pageSize };

  return useInfiniteQuery({
    queryKey: employeesQueryKey(listParams),
    queryFn: ({ pageParam }) =>
      employeeService.list({ ...listParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPagedParam,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
