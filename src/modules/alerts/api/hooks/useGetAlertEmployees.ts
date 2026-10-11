import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { alertEmployeesQueryKey } from "../queryKeys/alertQueryKeys";
import { alertService } from "../services/alert.service";
import type {
  TGetAlertEmployeesParams,
  TGetAlertEmployeesResponse,
} from "../../types";

export const useGetAlertEmployees = (
  params: TGetAlertEmployeesParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetAlertEmployeesResponse>({
    queryKey: alertEmployeesQueryKey(params),
    queryFn: () => alertService.employees(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
