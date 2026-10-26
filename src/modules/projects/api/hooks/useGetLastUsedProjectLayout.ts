import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { reportLayoutService } from "@/modules/reportLayout/api/services/reportLayout.service";
import { reportLayoutQueryRootKey } from "@/modules/reportLayout/api/queryKeys/reportLayoutQueryKeys";
import { PROJECT_EXPORT_REPORT_TYPE } from "../../constants/projectExport";

export const lastUsedProjectLayoutQueryKey = [
  ...reportLayoutQueryRootKey,
  "last-used",
  PROJECT_EXPORT_REPORT_TYPE,
] as const;

export const useGetLastUsedProjectLayout = (enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: lastUsedProjectLayoutQueryKey,
    queryFn: () => reportLayoutService.lastUsed(PROJECT_EXPORT_REPORT_TYPE),
    enabled: enabled && isAuthenticated,
  });
};
