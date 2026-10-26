import { queryClient } from "@/lib/queryClient";
import {
  activeProjectsQueryRootKey,
  projectEmployeeDirectoryQueryKey,
} from "@/modules/userControl/api/queryKeys/projectEmployeeQueryKeys";

export const projectResponsibleEngineerQueryRootKey = [
  "projectResponsibleEngineer",
] as const;

export const projectResponsibleEngineersQueryKey = (projectId: number) =>
  [...projectResponsibleEngineerQueryRootKey, "byProject", projectId] as const;

export const projectAssignedUsersQueryKey = (projectId: number) =>
  ["projectTeam", "assignedUsers", projectId] as const;

export const invalidateProjectResponsibleEngineers = async (
  projectId: number,
) => {
  await queryClient.invalidateQueries({
    queryKey: projectResponsibleEngineersQueryKey(projectId),
    refetchType: "all",
  });
};

export const invalidateProjectAssignedUsers = async (projectId: number) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: projectAssignedUsersQueryKey(projectId),
      refetchType: "all",
    }),
    queryClient.invalidateQueries({
      queryKey: projectEmployeeDirectoryQueryKey,
      refetchType: "all",
    }),
    queryClient.invalidateQueries({
      queryKey: activeProjectsQueryRootKey,
      refetchType: "all",
    }),
  ]);
};
