import { callEndpoint } from "@/lib/api/callEndpoint";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import { clientEndpoints } from "../endPoints/client.endpoints";
import type {
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
