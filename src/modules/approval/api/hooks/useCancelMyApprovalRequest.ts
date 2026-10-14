import { useMutation, useQueryClient } from "@tanstack/react-query";
import { myApprovalRequestsService } from "../services/myApprovalRequests.service";
import { myApprovalRequestsRootKey } from "../queryKeys/myApprovalRequestsQueryKeys";

export const useCancelMyApprovalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      myApprovalRequestsService.cancel(requestId),
    onSuccess: async (response) => {
      if (!response.isSuccess) return;
      await queryClient.invalidateQueries({
        queryKey: myApprovalRequestsRootKey,
      });
    },
  });
};
