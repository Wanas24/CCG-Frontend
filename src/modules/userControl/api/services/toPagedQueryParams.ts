import type { TPagedQueryParams } from "../../types";

export const toPagedQueryParams = (params: TPagedQueryParams = {}) => ({
  ...(params.page !== undefined ? { page: params.page } : {}),
  ...(params.pageSize !== undefined ? { pageSize: params.pageSize } : {}),
  ...(params.sortBy ? { sortBy: params.sortBy } : {}),
  ...(params.sortDescending !== undefined
    ? { sortDescending: params.sortDescending }
    : {}),
  ...(params.search ? { search: params.search } : {}),
});
