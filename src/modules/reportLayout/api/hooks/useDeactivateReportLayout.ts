import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportLayoutQueryRootKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useDeactivateReportLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (layoutId: string) => reportLayoutService.deactivate(layoutId),
    onSuccess: async (result) => {
      if (!result.isSuccess) return;
      await queryClient.invalidateQueries({ queryKey: reportLayoutQueryRootKey });
    },
  });
};
