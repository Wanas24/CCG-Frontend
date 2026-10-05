import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalQueryRootKey } from "../queryKeys/approvalWorkflowQueryKeys";
import type { TApprovalDecision } from "../../types";

type Vars = {
  requestId: string;
  decision: TApprovalDecision;
  comment?: string;
};

export const useForceDecideApprovalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, decision, comment }: Vars) =>
      approvalWorkflowService.forceDecide(requestId, decision, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: approvalQueryRootKey });
    },
  });
};
