import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalPendingRequestsQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";

export const APPROVAL_PENDING_PAGE_SIZE = 50;

export const useGetPendingApprovalRequests = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useInfiniteQuery({
    queryKey: approvalPendingRequestsQueryKey,
    queryFn: ({ pageParam }) =>
      approvalWorkflowService.getPendingRequests({
        page: pageParam,
        pageSize: APPROVAL_PENDING_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.isSuccess || !lastPage.data) return undefined;
      const { page, totalPages } = lastPage.data;
      if (page >= totalPages) return undefined;
      return page + 1;
    },
    enabled: isAuthenticated && enabled,
  });
};
