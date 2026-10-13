import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { projectAssignedUsersQueryKey } from "../queryKeys/projectTeamQueryKeys";
import { findProjectAssignedUsers } from "../../utils/findProjectAssignedUsers";
import type { TProjectUser } from "@/modules/userControl/types";

export const useGetProjectAssignedUsers = (
  projectId: number | null,
  searchHint: string,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    projectId != null &&
    Number.isFinite(projectId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TProjectUser[]>({
    queryKey: projectAssignedUsersQueryKey(projectId ?? 0),
    queryFn: () =>
      findProjectAssignedUsers(projectId as number, searchHint),
    enabled: canQuery,
  });
};
