import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalQueryRootKey } from "../queryKeys/approvalWorkflowQueryKeys";
import type { TSaveApprovalWorkflowBody } from "../../types";

export const useCreateApprovalWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TSaveApprovalWorkflowBody) =>
      approvalWorkflowService.createWorkflow(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: approvalQueryRootKey });
    },
  });
};
