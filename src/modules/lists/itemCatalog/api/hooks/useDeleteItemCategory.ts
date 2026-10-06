import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TDeleteItemCategoryResponse } from "../../types/itemCategory";

type ApiError = { message: string };

export const useDeleteItemCategory = () =>
  useMutation<TDeleteItemCategoryResponse, AxiosError<ApiError>, number>({
    mutationFn: itemCategoryService.delete,
  });
