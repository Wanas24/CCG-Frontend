import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalEntityTypesQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";

export const useGetApprovalEntityTypes = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: approvalEntityTypesQueryKey,
    queryFn: approvalWorkflowService.getEntityTypes,
    enabled: isAuthenticated && enabled,
  });
};
