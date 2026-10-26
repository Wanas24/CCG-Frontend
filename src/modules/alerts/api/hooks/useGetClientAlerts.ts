import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { AlertEntityType, type TAlert } from "../../types";
import { extractAlertPage } from "../../utils/extractAlertPage";
import { isAlertForClient } from "../../utils/isAlertForClient";
import { normalizeAlert } from "../../utils/normalizeAlert";
import { clientAlertsQueryKey } from "../queryKeys/alertQueryKeys";
import { alertService } from "../services/alert.service";

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

const clientAlertsParams = (clientId: number) =>
  ({
    page: 1,
    pageSize: PAGE_SIZE,
    liveOnly: false,
    entityId: clientId,
    entityType: AlertEntityType.Client,
  }) as const;

const fetchClientAlerts = async (clientId: number): Promise<TAlert[]> => {
  const response = await alertService.mine(clientAlertsParams(clientId));

  if (!response.isSuccess) {
    throw new Error(response.message || "alerts load failed");
  }

  const { rows } = extractAlertPage(response);
  return rows.map(normalizeAlert).filter((alert) => isAlertForClient(alert, clientId));
};

export const useGetClientAlerts = (clientId: number | null, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    clientId != null &&
    Number.isFinite(clientId) &&
    isAuthenticated &&
    companyId !== null;

  const listParams = clientAlertsParams(clientId ?? 0);

  return useQuery<TAlert[]>({
    queryKey: clientAlertsQueryKey(clientId ?? 0, listParams),
    queryFn: () => fetchClientAlerts(clientId as number),
    enabled: canQuery,
  });
};
