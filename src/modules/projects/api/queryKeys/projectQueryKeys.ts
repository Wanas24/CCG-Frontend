import { queryClient } from "@/lib/queryClient";
import type { TGetProjectsParams } from "../../types";

export const projectQueryRootKey = ["project"] as const;

export const projectsListQueryKey = (params: TGetProjectsParams) =>
  [...projectQueryRootKey, "list", params] as const;

export const projectDetailQueryKey = (projectId: number) =>
  [
    ...projectQueryRootKey,
    "detail",
    {
      id: projectId,
      page: 1,
      pageSize: 1,
    },
  ] as const;

export const removeProjectDetailQuery = (projectId: number) => {
  queryClient.removeQueries({ queryKey: projectDetailQueryKey(projectId) });
};

export const invalidateProjectQueries = async () => {
  await queryClient.invalidateQueries({
    queryKey: projectQueryRootKey,
    refetchType: "all",
  });
};
