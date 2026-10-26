import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectService } from "../services/project.service";
import type {
  TUploadProjectFilesRequest,
  TUploadProjectFilesResponse,
} from "../../types/projectFile";

type ApiError = { message: string };

export const useUploadProjectFiles = () =>
  useMutation<
    TUploadProjectFilesResponse,
    AxiosError<ApiError>,
    TUploadProjectFilesRequest
  >({
    mutationFn: projectService.uploadFiles,
  });
