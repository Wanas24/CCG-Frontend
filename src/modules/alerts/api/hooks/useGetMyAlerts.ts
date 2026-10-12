import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { myAlertsQueryKey } from "../queryKeys/alertQueryKeys";
import { alertService } from "../services/alert.service";
import type { TGetMyAlertsParams, TGetMyAlertsResponse } from "../../types";

export const useGetMyAlerts = (
  params: TGetMyAlertsParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetMyAlertsResponse>({
    queryKey: myAlertsQueryKey(params),
    queryFn: () => alertService.mine(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
