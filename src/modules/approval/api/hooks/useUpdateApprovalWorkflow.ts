import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalWorkflowService } from "../services/approvalWorkflow.service";
import { approvalQueryRootKey } from "../queryKeys/approvalWorkflowQueryKeys";
import type { TSaveApprovalWorkflowBody } from "../../types";

type Vars = {
  id: string;
  body: TSaveApprovalWorkflowBody;
};

export const useUpdateApprovalWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: Vars) =>
      approvalWorkflowService.updateWorkflow(id, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: approvalQueryRootKey });
    },
  });
};
