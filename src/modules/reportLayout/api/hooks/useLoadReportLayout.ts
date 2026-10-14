import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { reportLayoutDetailQueryKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useLoadReportLayout = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (layoutId: string) =>
      queryClient.fetchQuery({
        queryKey: reportLayoutDetailQueryKey(layoutId),
        queryFn: () => reportLayoutService.getById(layoutId),
        staleTime: 0,
      }),
    [queryClient],
  );
};
