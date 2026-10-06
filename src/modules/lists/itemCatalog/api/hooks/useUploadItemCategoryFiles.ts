import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TUploadItemCategoryFilesResponse } from "../../types/itemCategory";

type ApiError = { message: string };

type Variables = {
  id: number;
  files: File[];
};

export const useUploadItemCategoryFiles = () =>
  useMutation<
    TUploadItemCategoryFilesResponse,
    AxiosError<ApiError>,
    Variables
  >({
    mutationFn: ({ id, files }) => itemCategoryService.uploadFiles(id, files),
  });
