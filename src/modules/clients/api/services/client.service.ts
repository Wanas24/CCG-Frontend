import { callEndpoint } from "@/lib/api/callEndpoint";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import { clientEndpoints } from "../endPoints/client.endpoints";
import type {
  TCreateClientRequest,
  TCreateClientResponse,
  TGetClientsParams,
  TGetClientsResponse,
  TUpdateClientRequest,
  TUpdateClientResponse,
} from "../../types/client";

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
};
