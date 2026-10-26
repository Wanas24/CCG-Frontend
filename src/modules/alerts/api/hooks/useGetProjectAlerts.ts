import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TAlert } from "../../types";
import { extractAlertPage } from "../../utils/extractAlertPage";
import { normalizeAlert } from "../../utils/normalizeAlert";
import { projectAlertsQueryKey } from "../queryKeys/alertQueryKeys";
import { alertService } from "../services/alert.service";

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

const projectAlertsParams = (projectId: number) =>
  ({
    page: 1,
    pageSize: PAGE_SIZE,
    liveOnly: false,
    projectId,
  }) as const;

const fetchProjectAlerts = async (projectId: number): Promise<TAlert[]> => {
  const response = await alertService.mine(projectAlertsParams(projectId));

  if (!response.isSuccess) {
    throw new Error(response.message || "alerts load failed");
  }

  const { rows } = extractAlertPage(response);
  return rows.map(normalizeAlert);
};

export const useGetProjectAlerts = (
  projectId: number | null,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    projectId != null &&
    Number.isFinite(projectId) &&
    isAuthenticated &&
    companyId !== null;

  const listParams = projectAlertsParams(projectId ?? 0);

  return useQuery<TAlert[]>({
    queryKey: projectAlertsQueryKey(projectId ?? 0, listParams),
    queryFn: () => fetchProjectAlerts(projectId as number),
    enabled: canQuery,
  });
};
