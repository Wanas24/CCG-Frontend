import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { reportLayoutService } from "@/modules/reportLayout/api/services/reportLayout.service";
import { reportLayoutQueryRootKey } from "@/modules/reportLayout/api/queryKeys/reportLayoutQueryKeys";
import { CLIENT_EXPORT_REPORT_TYPE } from "../../constants/clientExport";

export const lastUsedClientLayoutQueryKey = [
  ...reportLayoutQueryRootKey,
  "last-used",
  CLIENT_EXPORT_REPORT_TYPE,
] as const;

export const useGetLastUsedClientLayout = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: lastUsedClientLayoutQueryKey,
    queryFn: () => reportLayoutService.lastUsed(CLIENT_EXPORT_REPORT_TYPE),
    enabled: enabled && isAuthenticated,
  });
};
