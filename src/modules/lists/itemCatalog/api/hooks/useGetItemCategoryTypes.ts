import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { itemCategoryTypesQueryKey } from "../queryKeys/itemCategoryQueryKeys";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TGetItemCategoryTypesResponse } from "../../types/itemCategory";

export const useGetItemCategoryTypes = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetItemCategoryTypesResponse>({
    queryKey: itemCategoryTypesQueryKey,
    queryFn: itemCategoryService.types,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
