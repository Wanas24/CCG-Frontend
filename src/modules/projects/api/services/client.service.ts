import { callEndpoint } from "@/lib/api/callEndpoint";
import { CLIENT_LOOKUP_PAGE_SIZE } from "../../constants/projectList";
import { clientEndpoints } from "../endPoints/client.endpoints";
import type {
  TGetClientsParams,
  TGetClientsResponse,
} from "../../types/client";

const toListQueryParams = (params: TGetClientsParams = {}) => ({
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? CLIENT_LOOKUP_PAGE_SIZE,
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
});

export const clientService = {
  list: (params?: TGetClientsParams) =>
    callEndpoint<TGetClientsResponse>(clientEndpoints.list, {
      queryParams: toListQueryParams(params),
    }),
};
