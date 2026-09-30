export type TPagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
};
