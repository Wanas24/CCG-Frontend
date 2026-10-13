import { queryClient } from "@/lib/queryClient";
import type { TGetProjectsParams } from "../../types";

export const projectQueryRootKey = ["project"] as const;

export const projectsListQueryRootKey = [...projectQueryRootKey, "list"] as const;

export const projectsListQueryKey = (params: TGetProjectsParams) =>
  [...projectsListQueryRootKey, params] as const;

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

export const projectFilesQueryKey = (projectId: number) =>
  [...projectQueryRootKey, "files", projectId] as const;

export const removeProjectDetailQuery = (projectId: number) => {
  queryClient.removeQueries({ queryKey: projectDetailQueryKey(projectId) });
};

export const removeProjectFilesQuery = (projectId: number) => {
  queryClient.removeQueries({ queryKey: projectFilesQueryKey(projectId) });
};

export const invalidateProjectListQueries = async () => {
  await queryClient.invalidateQueries({
    queryKey: projectsListQueryRootKey,
    refetchType: "all",
  });
};

export const invalidateProjectDetail = async (projectId: number) => {
  await queryClient.invalidateQueries({
    queryKey: projectDetailQueryKey(projectId),
    refetchType: "all",
  });
};

export const invalidateAfterProjectCreate = async () => {
  await queryClient.invalidateQueries({
    queryKey: projectsListQueryRootKey,
    refetchType: "none",
  });
};

export const invalidateAfterProjectUpdate = async (projectId: number) => {
  await Promise.all([
    invalidateProjectListQueries(),
    invalidateProjectDetail(projectId),
  ]);
};

export const invalidateAfterProjectDelete = async (projectId: number) => {
  removeProjectDetailQuery(projectId);
  removeProjectFilesQuery(projectId);
  await invalidateProjectListQueries();
};

export const invalidateProjectFiles = async (projectId: number) => {
  await queryClient.invalidateQueries({
    queryKey: projectFilesQueryKey(projectId),
    refetchType: "all",
  });
};
