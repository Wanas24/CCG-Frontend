import { callEndpoint } from "@/lib/api/callEndpoint";
import { CLIENTS_PAGE_SIZE } from "../../constants/clientList";
import { clientEndpoints } from "../endPoints/client.endpoints";
import type {
  TCreateClientRequest,
  TCreateClientResponse,
  TGetClientsParams,
  TGetClientsResponse,
} from "../../types/client";

const toListQueryParams = (params: TGetClientsParams = {}) => ({
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? CLIENTS_PAGE_SIZE,
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
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
};
