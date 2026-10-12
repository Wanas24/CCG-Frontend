import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TReportLayoutImagesResponse } from "../../types";
import { reportLayoutImagesQueryKey } from "../queryKeys/reportLayoutQueryKeys";
import { reportLayoutService } from "../services/reportLayout.service";

export const useUploadReportLayoutImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => reportLayoutService.uploadImage(file),
    onSuccess: (result) => {
      const uploaded = result.data;
      if (!result.isSuccess || !uploaded?.url) return;
      queryClient.setQueryData<TReportLayoutImagesResponse>(
        reportLayoutImagesQueryKey,
        (current) => {
          const images = Array.isArray(current?.data) ? current.data : [];
          return {
            isSuccess: true,
            message: result.message,
            errorCode: result.errorCode,
            data: [uploaded, ...images.filter((image) => image.fileId !== uploaded.fileId)],
          };
        },
      );
    },
  });
};
