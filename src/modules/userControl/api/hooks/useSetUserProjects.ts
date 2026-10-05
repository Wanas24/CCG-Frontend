import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { projectEmployeeService } from "../services/projectEmployee.service";
import type {
  TSetUserProjectsRequest,
  TSetUserProjectsResponse,
} from "../../types";

type ApiError = { message: string };

export const useSetUserProjects = () => {
  return useMutation<
    TSetUserProjectsResponse,
    AxiosError<ApiError>,
    TSetUserProjectsRequest
  >({
    mutationFn: (body) =>
      projectEmployeeService.setUserProjects(body.userId, body),
  });
};
