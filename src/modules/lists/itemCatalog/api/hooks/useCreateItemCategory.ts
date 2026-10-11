import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type {
  TCreateItemCategoryResponse,
  TItemCategoryWriteRequest,
} from "../../types/itemCategory";

type ApiError = { message: string };

export const useCreateItemCategory = () =>
  useMutation<
    TCreateItemCategoryResponse,
    AxiosError<ApiError>,
    TItemCategoryWriteRequest
  >({
    mutationFn: itemCategoryService.create,
  });
