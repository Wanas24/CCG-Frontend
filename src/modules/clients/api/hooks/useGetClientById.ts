import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { clientDetailQueryKey } from "../queryKeys/clientQueryKeys";
import { clientService } from "../services/client.service";
import type { TClient, TGetClientsResponse } from "../../types/client";

export const selectClientFromListResponse = (
  response: TGetClientsResponse | undefined,
  clientId?: number | null,
): TClient | null => {
  if (!response?.isSuccess || !response.data?.data?.length) return null;

  const rows = response.data.data;
  if (clientId != null) {
    const matched =
      rows.find((item) => Number(item.id) === Number(clientId)) ?? rows[0];
    return matched && Number(matched.id) === Number(clientId) ? matched : null;
  }

  return rows[0] ?? null;
};

export const useGetClientById = (clientId: number | null, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    clientId != null &&
    Number.isFinite(clientId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TGetClientsResponse>({
    queryKey: clientDetailQueryKey(clientId ?? 0),
    queryFn: () =>
      clientService.list({
        id: clientId as number,
        page: 1,
        pageSize: 1,
      }),
    enabled: canQuery,
  });
};
