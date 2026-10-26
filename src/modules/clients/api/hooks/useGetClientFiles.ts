import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { clientFilesQueryKey } from "../queryKeys/clientQueryKeys";
import { clientService } from "../services/client.service";
import type { TGetClientFilesResponse } from "../../types/clientFile";

export const useGetClientFiles = (
  clientId: number | null,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    clientId != null &&
    Number.isFinite(clientId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TGetClientFilesResponse>({
    queryKey: clientFilesQueryKey(clientId ?? 0),
    queryFn: () => clientService.files(clientId as number),
    enabled: canQuery,
  });
};
