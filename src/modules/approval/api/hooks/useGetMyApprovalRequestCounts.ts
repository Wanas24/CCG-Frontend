import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { myApprovalRequestsService } from "../services/myApprovalRequests.service";
import { myApprovalRequestCountsQueryKey } from "../queryKeys/myApprovalRequestsQueryKeys";
import type { TGetMyApprovalRequestCountsParams } from "../../types/myApprovalRequest";

export const useGetMyApprovalRequestCounts = (
  params: TGetMyApprovalRequestCountsParams,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery({
    queryKey: myApprovalRequestCountsQueryKey(params),
    queryFn: () => myApprovalRequestsService.counts(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
