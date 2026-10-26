import { queryClient } from "@/lib/queryClient";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import type {
  TGetAlertEmployeesParams,
  TGetMyAlertsParams,
} from "../../types";

export const alertQueryRootKey = ["alert"] as const;

export const myAlertsQueryKey = (params: TGetMyAlertsParams = {}) =>
  ["alert", "mine", params] as const;

export const projectAlertsQueryKey = (
  projectId: number,
  params: Pick<TGetMyAlertsParams, "page" | "pageSize" | "liveOnly"> = {},
) =>
  [
    "alert",
    "mine",
    "project",
    {
      projectId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
      liveOnly: params.liveOnly ?? false,
    },
  ] as const;

export const clientAlertsQueryKey = (
  clientId: number,
  params: Pick<
    TGetMyAlertsParams,
    "page" | "pageSize" | "liveOnly" | "entityType"
  > = {},
) =>
  [
    "alert",
    "mine",
    "client",
    {
      clientId,
      entityType: params.entityType,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
      liveOnly: params.liveOnly ?? false,
    },
  ] as const;

export const alertEmployeesQueryKey = (
  params: TGetAlertEmployeesParams = {},
) => ["alert", "employees", params] as const;

export const clearAlertQueries = async () => {
  await queryClient.cancelQueries({ queryKey: alertQueryRootKey });
  queryClient.removeQueries({ queryKey: alertQueryRootKey });
};

export const invalidateAlertQueries = async () => {
  await queryClient.invalidateQueries({ queryKey: alertQueryRootKey });
};
