import type { TGetProjectsParams } from "../../types";

export const projectQueryRootKey = ["project"] as const;

export const projectsListQueryKey = (params: TGetProjectsParams) =>
  [...projectQueryRootKey, "list", params] as const;
