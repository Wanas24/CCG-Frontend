import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TAlert } from "../../types";
import { extractAlertPage } from "../../utils/extractAlertPage";
import { isAlertForProject } from "../../utils/isAlertForProject";
import { normalizeAlert } from "../../utils/normalizeAlert";
import { projectAlertsQueryKey } from "../queryKeys/alertQueryKeys";
import { alertService } from "../services/alert.service";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

const fetchProjectAlerts = async (projectId: number): Promise<TAlert[]> => {
  const alerts: TAlert[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const response = await alertService.mine({
      page,
      pageSize: PAGE_SIZE,
      liveOnly: false,
    });

    if (!response.isSuccess) {
      throw new Error(response.message || "alerts load failed");
    }

    const { rows, totalCount } = extractAlertPage(response);
    alerts.push(...rows.map(normalizeAlert));
    totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);
    page += 1;
  }

  return alerts.filter((alert) => isAlertForProject(alert, projectId));
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

  return useQuery<TAlert[]>({
    queryKey: projectAlertsQueryKey(projectId ?? 0),
    queryFn: () => fetchProjectAlerts(projectId as number),
    enabled: canQuery,
  });
};
