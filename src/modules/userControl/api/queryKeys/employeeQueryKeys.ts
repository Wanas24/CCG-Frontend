import type { TGetEmployeesParams } from "../../types";

export const employeeQueryRootKey = ["employee"] as const;

export const employeesQueryKey = (params: TGetEmployeesParams = {}) =>
  ["employee", "list", params] as const;

export const employeeStatisticsQueryKey = [
  ...employeeQueryRootKey,
  "statistics",
] as const;
