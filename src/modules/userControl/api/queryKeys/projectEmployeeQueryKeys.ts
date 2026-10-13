import type { TGetActiveProjectsParams } from "../../types";

export const projectEmployeeQueryRootKey = ["projectEmployee"] as const;

export const projectEmployeeDirectoryQueryKey = [
  ...projectEmployeeQueryRootKey,
  "directory",
] as const;

export const activeProjectsQueryRootKey = [
  ...projectEmployeeQueryRootKey,
  "projects",
] as const;

export const activeProjectsQueryKey = (params: TGetActiveProjectsParams = {}) =>
  [...activeProjectsQueryRootKey, params] as const;
