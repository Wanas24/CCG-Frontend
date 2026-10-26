import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type {
  TGetActiveEntityApprovalRequestParams,
  TGetActiveEntityApprovalRequestResponse,
} from "../../types";
import { approvalActiveEntityRequestQueryKey } from "../queryKeys/approvalWorkflowQueryKeys";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";

export const useGetActiveEntityApprovalRequest = (
  params: TGetActiveEntityApprovalRequestParams | null,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    Boolean(params?.entityType) &&
    Boolean(params?.entityId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TGetActiveEntityApprovalRequestResponse>({
    queryKey: approvalActiveEntityRequestQueryKey(
      params?.entityType ?? "",
      params?.entityId ?? "",
    ),
    queryFn: () =>
      approvalWorkflowService.getActiveEntityRequest({
        entityType: params!.entityType,
        entityId: params!.entityId,
      }),
    enabled: canQuery,
  });
};
