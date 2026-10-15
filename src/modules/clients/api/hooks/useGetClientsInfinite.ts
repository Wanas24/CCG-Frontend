import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { nextPagedParam } from "@/modules/userControl/api/hooks/userControlPaging";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import { clientsInfiniteQueryKey } from "../queryKeys/clientQueryKeys";
import { clientService } from "../services/client.service";

export const useGetClientsInfinite = (search: string, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const trimmedSearch = search.trim();

  return useInfiniteQuery({
    queryKey: clientsInfiniteQueryKey(trimmedSearch),
    queryFn: ({ pageParam }) =>
      clientService.list({
        page: pageParam,
        pageSize: CLIENTS_PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      }),
    initialPageParam: 1,
    getNextPageParam: nextPagedParam,
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
