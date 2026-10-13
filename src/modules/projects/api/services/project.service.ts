import axios from "axios";
import { callEndpoint } from "@/lib/api/callEndpoint";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";
import apiClient from "@/lib/api/apiClient";
import {
  PROJECT_SORT_BY,
  PROJECTS_PAGE_SIZE,
} from "../../constants/projectList";
import {
  buildProjectExportSearchParams,
  type TProjectExportRequest,
} from "../../utils/projectExportParams";
import {
  defaultProjectExportFileName,
  fileNameFromContentDisposition,
} from "../../utils/projectExportDownload";
import { projectEndpoints } from "../endPoints/project.endpoints";
import type {
  TCreateProjectRequest,
  TCreateProjectResponse,
  TDeleteProjectResponse,
  TGetProjectsParams,
  TGetProjectsResponse,
  TProjectExportResult,
  TUpdateProjectRequest,
  TUpdateProjectResponse,
} from "../../types/project";
import type {
  TDeleteProjectFileResponse,
  TDownloadProjectFileResponse,
  TGetProjectFilesResponse,
  TUploadProjectFilesRequest,
  TUploadProjectFilesResponse,
} from "../../types/projectFile";

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

const readBlobMessage = async (data: unknown) => {
  if (!(data instanceof Blob)) return "";
  try {
    const text = await data.text();
    const parsed: unknown = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      "message" in parsed &&
      typeof parsed.message === "string"
    ) {
      return parsed.message;
    }
  } catch {
    return "";
  }
  return "";
};

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

  export: async (
    request: TProjectExportRequest,
  ): Promise<TProjectExportResult> => {
    const search = buildProjectExportSearchParams(request);
    const fallbackName = defaultProjectExportFileName(
      request.format,
      request.title,
    );

    try {
      const response = await apiClient.request<Blob>({
        url: `${projectEndpoints.export.path}?${search.toString()}`,
        method: projectEndpoints.export.method,
        responseType: "blob",
        skipToast: true,
      });

      const blob = response.data;
      if (!(blob instanceof Blob) || blob.size === 0) {
        return { ok: false, message: "" };
      }

      const contentType =
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : "";
      if (contentType.toLowerCase().includes("application/json")) {
        return { ok: false, message: await readBlobMessage(blob) };
      }

      const disposition =
        typeof response.headers["content-disposition"] === "string"
          ? response.headers["content-disposition"]
          : undefined;

      return {
        ok: true,
        blob,
        fileName: fileNameFromContentDisposition(disposition, fallbackName),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        return {
          ok: false,
          message: await readBlobMessage(error.response.data),
        };
      }
      return {
        ok: false,
        message: getSimpleResultFromAxiosError(error)?.message ?? "",
      };
    }
  },

  files: (projectId: number) =>
    callEndpoint<TGetProjectFilesResponse>(projectEndpoints.files, {
      pathParams: { id: projectId },
    }),

  uploadFiles: ({
    projectId,
    files,
    names,
    descriptions,
  }: TUploadProjectFilesRequest) => {
    const body = new FormData();
    files.forEach((file, index) => {
      body.append("Files", file);
      body.append("Names", names[index] ?? "");
      body.append("Descriptions", descriptions[index] ?? "");
    });

    return callEndpoint<TUploadProjectFilesResponse, FormData>(
      projectEndpoints.uploadFile,
      { queryParams: { id: projectId }, body },
    );
  },

  downloadFile: (fileId: number) =>
    callEndpoint<TDownloadProjectFileResponse>(projectEndpoints.downloadFile, {
      pathParams: { fileId },
    }),

  deleteFile: (fileId: number) =>
    callEndpoint<TDeleteProjectFileResponse>(projectEndpoints.deleteFile, {
      pathParams: { fileId },
    }),
};
