import { queryClient } from "@/lib/queryClient";
import { projectEmployeeQueryRootKey } from "@/modules/userControl/api/queryKeys/projectEmployeeQueryKeys";

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
  await queryClient.invalidateQueries({
    queryKey: projectAssignedUsersQueryKey(projectId),
    refetchType: "all",
  });
  await queryClient.invalidateQueries({
    queryKey: projectEmployeeQueryRootKey,
    refetchType: "all",
  });
};
