import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type { TDeleteProjectFileResponse } from "../../types/projectFile";

type ApiError = { message: string };

export const useDeleteProjectFile = () =>
  useMutation<TDeleteProjectFileResponse, AxiosError<ApiError>, number>({
    mutationFn: projectService.deleteFile,
  });
