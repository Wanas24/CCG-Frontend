import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TGetItemCategoryFileUrlResponse } from "../../types/itemCategory";

type ApiError = { message: string };

export const useGetItemCategoryFileUrl = () =>
  useMutation<TGetItemCategoryFileUrlResponse, AxiosError<ApiError>, number>({
    mutationFn: itemCategoryService.fileUrl,
  });
