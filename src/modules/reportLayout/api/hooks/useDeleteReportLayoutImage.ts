import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TReportLayoutImagesResponse } from "../../types";
import { reportLayoutImagesQueryKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useDeleteReportLayoutImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: number) => reportLayoutService.deleteImage(fileId),
    onSuccess: (result, fileId) => {
      if (!result.isSuccess) return;
      queryClient.setQueryData<TReportLayoutImagesResponse>(
        reportLayoutImagesQueryKey,
        (current) => {
          if (!current?.data) return current;
          return {
            ...current,
            data: current.data.filter((image) => image.fileId !== fileId),
          };
        },
      );
    },
  });
};
