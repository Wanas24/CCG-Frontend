export type TPagedQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  search?: string;
};

export type TApiPagedResult<T> = {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
