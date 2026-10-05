import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalWorkflowsQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";

export const useGetApprovalWorkflows = (
  includeInactive = true,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: approvalWorkflowsQueryKey(includeInactive),
    queryFn: () => approvalWorkflowService.getWorkflows(includeInactive),
    enabled: isAuthenticated && enabled,
  });
};
