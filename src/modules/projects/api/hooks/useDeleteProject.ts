import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type { TDeleteProjectResponse } from "../../types/project";

type ApiError = { message: string };

export const useDeleteProject = () =>
  useMutation<TDeleteProjectResponse, AxiosError<ApiError>, number>({
    mutationFn: projectService.delete,
  });
