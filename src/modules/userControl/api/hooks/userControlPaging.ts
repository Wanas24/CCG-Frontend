import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult } from "../../types";

export const USER_CONTROL_PAGE_SIZE = 20;

export const nextPagedParam = <T>(lastPage: TSimpleResult<TApiPagedResult<T>>) => {
  if (!lastPage.isSuccess || !lastPage.data) return undefined;
  const { page, totalPages } = lastPage.data;
  if (page >= totalPages) return undefined;
  return page + 1;
};
