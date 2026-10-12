import { useMutation } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import type { TProjectExportRequest } from "../../utils/projectExportParams";
import type { TProjectExportResult } from "../../types/project";

export const useExportProject = () =>
  useMutation<TProjectExportResult, Error, TProjectExportRequest>({
    mutationFn: projectService.export,
  });
