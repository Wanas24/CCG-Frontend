import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { projectsListQueryKey } from "../queryKeys/projectQueryKeys";
import { projectService } from "../services/project.service";
import type {
  TGetProjectsParams,
  TGetProjectsResponse,
} from "../../types/project";

export const useGetProjects = (
  params: TGetProjectsParams,
  enabled = true,
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  return useQuery<TGetProjectsResponse>({
    queryKey: projectsListQueryKey(params),
    queryFn: () => projectService.list(params),
    enabled: enabled && isAuthenticated && companyId !== null,
  });
};
