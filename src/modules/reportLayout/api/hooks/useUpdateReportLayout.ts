import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TLayoutInput } from "../../types";
import { reportLayoutQueryRootKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

type TUpdateVariables = {
  layoutId: string;
  body: TLayoutInput;
};

export const useUpdateReportLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ layoutId, body }: TUpdateVariables) =>
      reportLayoutService.update(layoutId, body),
    onSuccess: async (result) => {
      if (!result.isSuccess) return;
      await queryClient.invalidateQueries({ queryKey: reportLayoutQueryRootKey });
    },
  });
};
