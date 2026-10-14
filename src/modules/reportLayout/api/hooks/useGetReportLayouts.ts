import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { reportLayoutService } from "../services/reportLayout.service";
import { reportLayoutsQueryKey } from "../queryKeys/reportLayoutQueryKeys";

export const useGetReportLayouts = (includeInactive: boolean, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: reportLayoutsQueryKey(includeInactive),
    queryFn: () => reportLayoutService.list(includeInactive),
    enabled: isAuthenticated && enabled,
  });
};
