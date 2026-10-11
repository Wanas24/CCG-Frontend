import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { itemCategoryService } from "../services/itemCategory.service";
import type {
  TItemCategoryUpdateRequest,
  TUpdateItemCategoryResponse,
} from "../../types/itemCategory";

type ApiError = { message: string };

export const useUpdateItemCategory = () =>
  useMutation<
    TUpdateItemCategoryResponse,
    AxiosError<ApiError>,
    TItemCategoryUpdateRequest
  >({
    mutationFn: itemCategoryService.update,
  });
