import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { projectFilesQueryKey } from "../queryKeys/projectQueryKeys";
import { projectService } from "../services/project.service";
import type { TGetProjectFilesResponse } from "../../types/projectFile";

export const useGetProjectFiles = (
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

  return useQuery<TGetProjectFilesResponse>({
    queryKey: projectFilesQueryKey(projectId ?? 0),
    queryFn: () => projectService.files(projectId as number),
    enabled: canQuery,
  });
};
