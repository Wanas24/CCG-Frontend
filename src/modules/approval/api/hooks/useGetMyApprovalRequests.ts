import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { myApprovalRequestsService } from "../services/myApprovalRequests.service";
import { myApprovalRequestsListQueryKey } from "../queryKeys/myApprovalRequestsQueryKeys";
import type { TGetMyApprovalRequestsParams } from "../../types/myApprovalRequest";

export const useGetMyApprovalRequests = (
  params: TGetMyApprovalRequestsParams,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery({
    queryKey: myApprovalRequestsListQueryKey(params),
    queryFn: () => myApprovalRequestsService.list(params),
    enabled: enabled && isAuthenticated && companyId !== null,
    placeholderData: keepPreviousData,
  });
};
