import { queryClient } from "@/lib/queryClient";
import type { TGetItemCategoriesParams } from "../../types/itemCategory";

export const itemCategoryQueryRootKey = ["itemCategory"] as const;

export const itemCategoriesQueryKey = (
  params: TGetItemCategoriesParams = {},
) => ["itemCategory", "list", params] as const;

export const itemCategoryTypesQueryKey = ["itemCategory", "types"] as const;

export const itemCategoryFilesQueryKey = (id: number) =>
  ["itemCategory", "files", id] as const;

export const clearItemCategoryQueries = async () => {
  await queryClient.cancelQueries({ queryKey: itemCategoryQueryRootKey });
  queryClient.removeQueries({ queryKey: itemCategoryQueryRootKey });
};

export const invalidateItemCategoryQueries = async () => {
  await queryClient.invalidateQueries({ queryKey: itemCategoryQueryRootKey });
};

export const invalidateItemCategoryFiles = async (id: number) => {
  await queryClient.invalidateQueries({
    queryKey: itemCategoryFilesQueryKey(id),
  });
};
