import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { PROJECT_SORT_BY } from "../../constants/projectList";
import { projectDetailQueryKey } from "../queryKeys/projectQueryKeys";
import { projectService } from "../services/project.service";
import type { TGetProjectsResponse } from "../../types/project";

export const useGetProject = (projectId: number | null, enabled = true) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery =
    enabled &&
    projectId != null &&
    Number.isFinite(projectId) &&
    isAuthenticated &&
    companyId !== null;

  return useQuery<TGetProjectsResponse>({
    queryKey: projectDetailQueryKey(projectId ?? 0),
    queryFn: () =>
      projectService.list({
        id: projectId as number,
        page: 1,
        pageSize: 1,
        sortBy: PROJECT_SORT_BY,
        sortDescending: true,
      }),
    enabled: canQuery,
  });
};
