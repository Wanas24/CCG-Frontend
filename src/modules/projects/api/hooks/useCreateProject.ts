import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type {
  TCreateProjectRequest,
  TCreateProjectResponse,
} from "../../types/project";

type ApiError = { message: string };

export const useCreateProject = () =>
  useMutation<
    TCreateProjectResponse,
    AxiosError<ApiError>,
    TCreateProjectRequest
  >({
    mutationFn: projectService.create,
  });
