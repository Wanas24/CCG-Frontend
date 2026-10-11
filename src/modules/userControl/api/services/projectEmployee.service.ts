import { callEndpoint } from "@/lib/api/callEndpoint";
import { projectEmployeeEndpoints } from "../endPoints/projectEmployee.endpoints";
import { toPagedQueryParams } from "./toPagedQueryParams";
import type {
  TGetActiveProjectsParams,
  TGetActiveProjectsResponse,
  TSetUserProjectsRequest,
  TSetUserProjectsResponse,
} from "../../types";

export const projectEmployeeService = {
  projects: (params?: TGetActiveProjectsParams) =>
    callEndpoint<TGetActiveProjectsResponse>(
      projectEmployeeEndpoints.projects,
      { queryParams: toPagedQueryParams(params) },
    ),

  userProjects: (userId: string, params?: TGetActiveProjectsParams) =>
    callEndpoint<TGetActiveProjectsResponse>(
      projectEmployeeEndpoints.userProjects,
      {
        pathParams: { userId },
        queryParams: toPagedQueryParams(params),
      },
    ),

  setUserProjects: (userId: string, body: TSetUserProjectsRequest) =>
    callEndpoint<TSetUserProjectsResponse, TSetUserProjectsRequest>(
      projectEmployeeEndpoints.setUserProjects,
      { pathParams: { userId }, body },
    ),
};
