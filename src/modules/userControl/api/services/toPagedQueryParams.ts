import { DEFAULT_PAGE_SIZE } from "@/lib/api/pagination";
import type { TPagedQueryParams } from "../../types";

export const USER_CONTROL_PAGE_SIZE = DEFAULT_PAGE_SIZE;

export const toPagedQueryParams = (params: TPagedQueryParams = {}) => ({
  ...(params.page !== undefined ? { page: params.page } : {}),
  pageSize: params.pageSize ?? USER_CONTROL_PAGE_SIZE,
  ...(params.sortBy ? { sortBy: params.sortBy } : {}),
  ...(params.sortDescending !== undefined
    ? { sortDescending: params.sortDescending }
    : {}),
  ...(params.search ? { search: params.search } : {}),
});
