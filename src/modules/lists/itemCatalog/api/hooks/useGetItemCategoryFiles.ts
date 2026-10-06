import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { itemCategoryFilesQueryKey } from "../queryKeys/itemCategoryQueryKeys";
import { itemCategoryService } from "../services/itemCategory.service";
import type { TGetItemCategoryFilesResponse } from "../../types/itemCategory";

export const useGetItemCategoryFiles = (id: number | null, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetItemCategoryFilesResponse>({
    queryKey: itemCategoryFilesQueryKey(id ?? 0),
    queryFn: () => itemCategoryService.files(id!),
    enabled:
      enabled &&
      id !== null &&
      isAuthenticated &&
      companyId !== null,
  });
};
