import type { TGetActiveProjectsParams } from "../../types";

export const projectEmployeeQueryRootKey = ["projectEmployee"] as const;

export const activeProjectsQueryKey = (params: TGetActiveProjectsParams = {}) =>
  ["projectEmployee", "projects", params] as const;
