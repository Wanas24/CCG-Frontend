import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TDeleteItemCategoryFileResponse } from "../../types/itemCategory";

type ApiError = { message: string };

export const useDeleteItemCategoryFile = () =>
  useMutation<TDeleteItemCategoryFileResponse, AxiosError<ApiError>, number>({
    mutationFn: itemCategoryService.deleteFile,
  });
