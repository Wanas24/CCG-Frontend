import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import { clientsListQueryKey } from "../queryKeys/clientQueryKeys";
import { clientService } from "../services/client.service";
import type {
  TGetClientsParams,
  TGetClientsResponse,
} from "../../types/client";

export const useGetClients = (
  params: TGetClientsParams = {
    page: 1,
    pageSize: CLIENTS_PAGE_SIZE,
  },
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetClientsResponse>({
    queryKey: clientsListQueryKey(params),
    queryFn: () => clientService.list(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
