import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type {
  TGetEntityApprovalRequestsParams,
  TGetEntityApprovalRequestsResponse,
} from "../../types";
import { approvalEntityRequestsQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";

export const useGetEntityApprovalRequests = (
  params: TGetEntityApprovalRequestsParams | null,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const take = params?.take ?? 50;
  const canQuery =
    enabled &&
    Boolean(params?.entityType) &&
    Boolean(params?.entityId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TGetEntityApprovalRequestsResponse>({
    queryKey: approvalEntityRequestsQueryKey(
      params?.entityType ?? "",
      params?.entityId ?? "",
      take,
    ),
    queryFn: () =>
      approvalWorkflowService.getEntityRequests({
        entityType: params!.entityType,
        entityId: params!.entityId,
        take,
      }),
    enabled: canQuery,
  });
};
