import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { itemCategoriesQueryKey } from "../queryKeys/itemCategoryQueryKeys";
import { itemCategoryService } from "../services/itemCategory.service";
import type {
  TGetItemCategoriesParams,
  TGetItemCategoriesResponse,
} from "../../types/itemCategory";

export const useGetItemCategories = (
  params: TGetItemCategoriesParams = {},
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetItemCategoriesResponse>({
    queryKey: itemCategoriesQueryKey(params),
    queryFn: () => itemCategoryService.list(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
