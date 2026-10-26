import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TGetEmployeeStatisticsResponse } from "../../types";
import { employeeStatisticsQueryKey } from "../queryKeys/employeeQueryKeys";
import { employeeService } from "../services/employee.service";

export const useGetEmployeeStatistics = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetEmployeeStatisticsResponse>({
    queryKey: employeeStatisticsQueryKey,
    queryFn: () => employeeService.statistics(),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
