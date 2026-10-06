import { useMutation } from "@tanstack/react-query";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import type { TApprovalDecision } from "../../types";

type Vars = {
  requestId: string;
  decision: TApprovalDecision;
  comment?: string;
};

export const useForceDecideApprovalRequest = () => {
  return useMutation({
    mutationFn: ({ requestId, decision, comment }: Vars) =>
      approvalWorkflowService.forceDecide(requestId, decision, comment),
  });
};
