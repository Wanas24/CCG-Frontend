import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TLayoutInput } from "../../types";
import { reportLayoutQueryRootKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useCreateReportLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TLayoutInput) => reportLayoutService.create(body),
    onSuccess: async (result) => {
      if (!result.isSuccess) return;
      await queryClient.invalidateQueries({ queryKey: reportLayoutQueryRootKey });
    },
  });
};
