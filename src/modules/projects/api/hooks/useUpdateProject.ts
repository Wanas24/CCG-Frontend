import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type {
  TUpdateProjectRequest,
  TUpdateProjectResponse,
} from "../../types/project";

type ApiError = { message: string };

export const useUpdateProject = () =>
  useMutation<
    TUpdateProjectResponse,
    AxiosError<ApiError>,
    TUpdateProjectRequest
  >({
    mutationFn: projectService.update,
  });
