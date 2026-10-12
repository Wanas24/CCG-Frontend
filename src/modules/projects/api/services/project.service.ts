import { callEndpoint } from "@/lib/api/callEndpoint";
import {
  PROJECT_SORT_BY,
  PROJECTS_PAGE_SIZE,
} from "../../constants/projectList";
import { projectEndpoints } from "../endPoints/project.endpoints";
import type {
  TCreateProjectRequest,
  TCreateProjectResponse,
  TDeleteProjectResponse,
  TGetProjectsParams,
  TGetProjectsResponse,
  TUpdateProjectRequest,
  TUpdateProjectResponse,
} from "../../types/project";

const toListQueryParams = (params: TGetProjectsParams = {}) => ({
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? PROJECTS_PAGE_SIZE,
  SortBy: params.sortBy ?? PROJECT_SORT_BY,
  SortDescending: params.sortDescending ?? true,
  ...(params.id !== undefined ? { Id: params.id } : {}),
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
  ...(params.status !== undefined && params.status !== ""
    ? { Status: params.status }
    : {}),
  ...(params.approvalStatus !== undefined && params.approvalStatus !== ""
    ? { ApprovalStatus: params.approvalStatus }
    : {}),
  ...(params.projectType !== undefined && params.projectType !== ""
    ? { ProjectType: params.projectType }
    : {}),
  ...(params.isActive !== undefined && params.isActive !== ""
    ? { IsActive: params.isActive }
    : {}),
  ...(params.clientId !== undefined && params.clientId !== ""
    ? { ClientId: params.clientId }
    : {}),
});

export const projectService = {
  list: (params?: TGetProjectsParams) =>
    callEndpoint<TGetProjectsResponse>(projectEndpoints.list, {
      queryParams: toListQueryParams(params),
    }),

  create: (body: TCreateProjectRequest) =>
    callEndpoint<TCreateProjectResponse, TCreateProjectRequest>(
      projectEndpoints.create,
      { body },
    ),

  update: (body: TUpdateProjectRequest) =>
    callEndpoint<TUpdateProjectResponse, TUpdateProjectRequest>(
      projectEndpoints.update,
      { body },
    ),

  delete: (projectId: number) =>
    callEndpoint<TDeleteProjectResponse>(projectEndpoints.delete, {
      queryParams: { projectId },
    }),
};
