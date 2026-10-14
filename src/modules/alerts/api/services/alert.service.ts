import { callEndpoint } from "@/lib/api/callEndpoint";
import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import { alertEndpoints } from "../endPoints/alert.endpoints";
import type {
  TAlertActionResponse,
  TCreateAlertRequest,
  TCreateAlertResponse,
  TGetAlertEmployeesParams,
  TGetAlertEmployeesResponse,
  TGetMyAlertsParams,
  TGetMyAlertsResponse,
} from "../../types";

const MAX_PAGE_SIZE = 100;

const toMineQueryParams = (params: TGetMyAlertsParams = {}) => {
  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  return {
    Page: page,
    PageSize: pageSize,
    LiveOnly: params.liveOnly ?? false,
    ...(params.search ? { Search: params.search } : {}),
    ...(params.sortBy ? { SortBy: params.sortBy } : {}),
    ...(params.sortDescending !== undefined
      ? { SortDescending: params.sortDescending }
      : {}),
    ...(params.isDone !== undefined ? { IsDone: params.isDone } : {}),
    ...(params.isCanceled !== undefined
      ? { IsCanceled: params.isCanceled }
      : {}),
  };
};

const toEmployeesQueryParams = (params: TGetAlertEmployeesParams = {}) => {
  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  return {
    Page: page,
    PageSize: pageSize,
    ...(params.search ? { Search: params.search } : {}),
    ...(params.sortBy ? { SortBy: params.sortBy } : {}),
    ...(params.sortDescending !== undefined
      ? { SortDescending: params.sortDescending }
      : {}),
    ...(params.isManager !== undefined ? { IsManager: params.isManager } : {}),
    ...(params.isFired !== undefined ? { IsFired: params.isFired } : {}),
    ...(params.isActive !== undefined ? { IsActive: params.isActive } : {}),
  };
};

export const alertService = {
  mine: (params?: TGetMyAlertsParams) =>
    callEndpoint<TGetMyAlertsResponse>(alertEndpoints.mine, {
      queryParams: toMineQueryParams(params),
    }),

  employees: (params?: TGetAlertEmployeesParams) =>
    callEndpoint<TGetAlertEmployeesResponse>(alertEndpoints.employees, {
      queryParams: toEmployeesQueryParams(params),
    }),

  create: (body: TCreateAlertRequest) =>
    callEndpoint<TCreateAlertResponse, TCreateAlertRequest>(
      alertEndpoints.create,
      { body },
    ),

  done: (id: number) =>
    callEndpoint<TAlertActionResponse>(alertEndpoints.done, {
      pathParams: { id },
    }),

  cancel: (id: number) =>
    callEndpoint<TAlertActionResponse>(alertEndpoints.cancel, {
      pathParams: { id },
    }),

  remove: (id: number) =>
    callEndpoint<TAlertActionResponse>(alertEndpoints.remove, {
      pathParams: { id },
    }),
};
