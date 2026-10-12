import { queryClient } from "@/lib/queryClient";
import type {
  TGetAlertEmployeesParams,
  TGetMyAlertsParams,
} from "../../types";

export const alertQueryRootKey = ["alert"] as const;

export const myAlertsQueryKey = (params: TGetMyAlertsParams = {}) =>
  ["alert", "mine", params] as const;

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
