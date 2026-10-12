import { callEndpoint } from "@/lib/api/callEndpoint";
import { MY_APPROVAL_REQUESTS_PAGE_SIZE } from "../../constants/myApprovalRequests";
import { myApprovalRequestsEndpoints } from "../endPoints/myApprovalRequests.endpoints";
import type {
  TGetMyApprovalRequestCountsParams,
  TGetMyApprovalRequestCountsResponse,
  TGetMyApprovalRequestsParams,
  TGetMyApprovalRequestsResponse,
} from "../../types/myApprovalRequest";

const toListQueryParams = (params: TGetMyApprovalRequestsParams = {}) => ({
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? MY_APPROVAL_REQUESTS_PAGE_SIZE,
  SortDescending: params.sortDescending ?? true,
  ...(params.entityType ? { EntityType: params.entityType } : {}),
  ...(params.status !== undefined && params.status !== ""
    ? { Status: params.status }
    : {}),
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
});

const toCountsQueryParams = (
  params: TGetMyApprovalRequestCountsParams = {},
) => ({
  ...(params.entityType ? { EntityType: params.entityType } : {}),
  ...(params.search?.trim() ? { Search: params.search.trim() } : {}),
});

export const myApprovalRequestsService = {
  list: (params?: TGetMyApprovalRequestsParams) =>
    callEndpoint<TGetMyApprovalRequestsResponse>(
      myApprovalRequestsEndpoints.list,
      { queryParams: toListQueryParams(params) },
    ),

  counts: (params?: TGetMyApprovalRequestCountsParams) =>
    callEndpoint<TGetMyApprovalRequestCountsResponse>(
      myApprovalRequestsEndpoints.counts,
      { queryParams: toCountsQueryParams(params) },
    ),
};
