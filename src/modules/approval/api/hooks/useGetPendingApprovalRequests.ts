import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalPendingRequestsQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";

export const useGetPendingApprovalRequests = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: approvalPendingRequestsQueryKey,
    queryFn: () => approvalWorkflowService.getPendingRequests(),
    enabled: isAuthenticated && enabled,
  });
};
