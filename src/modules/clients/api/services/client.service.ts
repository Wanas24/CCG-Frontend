import axios from "axios";
import { callEndpoint } from "@/lib/api/callEndpoint";
import { getSimpleResultFromAxiosError } from "@/lib/api/applyApiFieldErrors";
import apiClient from "@/lib/api/apiClient";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import {
  buildClientExportSearchParams,
  type TClientExportRequest,
} from "../../utils/clientExportParams";
import {
  defaultClientExportFileName,
  fileNameFromContentDisposition,
} from "../../utils/clientExportDownload";
import { clientEndpoints } from "../endPoints/client.endpoints";
import type {
  TClientExportResult,
  TCreateClientRequest,
  TCreateClientResponse,
  TDeleteClientResponse,
  TGetClientsParams,
  TGetClientsResponse,
  TUpdateClientRequest,
  TUpdateClientResponse,
} from "../../types/client";
import type {
  TDeleteClientFileResponse,
  TDownloadClientFileResponse,
  TGetClientFilesResponse,
  TUploadClientFilesRequest,
  TUploadClientFilesResponse,
} from "../../types/clientFile";

const toListQueryParams = (params: TGetClientsParams = {}) => ({
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? CLIENTS_PAGE_SIZE,
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
  ...(params.id != null && Number.isFinite(params.id) && params.id > 0
    ? { Id: params.id }
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

export const clientService = {
  list: (params?: TGetClientsParams) =>
    callEndpoint<TGetClientsResponse>(clientEndpoints.list, {
      queryParams: toListQueryParams(params),
    }),

  create: (body: TCreateClientRequest) =>
    callEndpoint<TCreateClientResponse, TCreateClientRequest>(
      clientEndpoints.create,
      { body },
    ),

  update: (body: TUpdateClientRequest) =>
    callEndpoint<TUpdateClientResponse, TUpdateClientRequest>(
      clientEndpoints.update,
      { body },
    ),

  delete: (clientId: number) =>
    callEndpoint<TDeleteClientResponse>(clientEndpoints.delete, {
      queryParams: { clientId },
    }),

  export: async (
    request: TClientExportRequest,
  ): Promise<TClientExportResult> => {
    const search = buildClientExportSearchParams(request);
    const fallbackName = defaultClientExportFileName(
      request.format,
      request.title,
    );

    try {
      const response = await apiClient.request<Blob>({
        url: `${clientEndpoints.export.path}?${search.toString()}`,
        method: clientEndpoints.export.method,
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

  files: (clientId: number) =>
    callEndpoint<TGetClientFilesResponse>(clientEndpoints.files, {
      pathParams: { id: clientId },
    }),

  uploadFiles: ({
    clientId,
    files,
    names,
    descriptions,
  }: TUploadClientFilesRequest) => {
    const body = new FormData();
    files.forEach((file, index) => {
      body.append("Files", file);
      body.append("Names", names[index] ?? "");
      body.append("Descriptions", descriptions[index] ?? "");
    });

    return callEndpoint<TUploadClientFilesResponse, FormData>(
      clientEndpoints.uploadFile,
      { queryParams: { id: clientId }, body },
    );
  },

  downloadFile: (fileId: number) =>
    callEndpoint<TDownloadClientFileResponse>(clientEndpoints.downloadFile, {
      pathParams: { fileId },
    }),

  deleteFile: (fileId: number) =>
    callEndpoint<TDeleteClientFileResponse>(clientEndpoints.deleteFile, {
      pathParams: { fileId },
    }),
};
