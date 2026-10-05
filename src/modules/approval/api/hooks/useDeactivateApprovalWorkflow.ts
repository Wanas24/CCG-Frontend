import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalQueryRootKey } from "../queryKeys/approvalWorkflowQueryKeys";

export const useDeactivateApprovalWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approvalWorkflowService.deactivateWorkflow(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: approvalQueryRootKey });
    },
  });
};
