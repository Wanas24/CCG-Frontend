import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type { TDownloadProjectFileResponse } from "../../types/projectFile";

type ApiError = { message: string };

export const useDownloadProjectFile = () =>
  useMutation<TDownloadProjectFileResponse, AxiosError<ApiError>, number>({
    mutationFn: projectService.downloadFile,
  });
