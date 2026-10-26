import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { projectResponsibleEngineersQueryKey } from "../queryKeys/projectTeamQueryKeys";
import { projectResponsibleEngineerService } from "../services/projectResponsibleEngineer.service";
import type { TGetProjectResponsibleEngineersResponse } from "../../types/projectResponsibleEngineer";

export const useGetProjectResponsibleEngineers = (
  projectId: number | null,
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

  return useQuery<TGetProjectResponsibleEngineersResponse>({
    queryKey: projectResponsibleEngineersQueryKey(projectId ?? 0),
    queryFn: () =>
      projectResponsibleEngineerService.byProject(projectId as number),
    enabled: canQuery,
  });
};
