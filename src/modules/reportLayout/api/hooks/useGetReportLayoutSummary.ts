import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { reportLayoutService } from "../services/reportLayout.service";
import { reportLayoutSummaryQueryKey } from "../queryKeys/reportLayoutQueryKeys";

export const useGetReportLayoutSummary = (includeInactive: boolean, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: reportLayoutSummaryQueryKey(includeInactive),
    queryFn: () => reportLayoutService.getSummary(includeInactive),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated && enabled,
  });
};
