import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult } from "../../types";

export const USER_CONTROL_PAGE_SIZE = 20;

export const nextPagedParam = <T>(lastPage: TSimpleResult<TApiPagedResult<T>>) => {
  if (!lastPage.isSuccess || !lastPage.data) return undefined;
  const { page, totalPages } = lastPage.data;
  if (page >= totalPages) return undefined;
  return page + 1;
};

export const readAllPages = async <T>(
  fetchPage: (page: number) => Promise<TSimpleResult<TApiPagedResult<T>>>,
) => {
  const items: T[] = [];
  let page = 1;

  while (page <= 100) {
    const result = await fetchPage(page);
    if (!result.isSuccess || !result.data) {
      throw new Error(result.message || "list failed");
    }
    items.push(...result.data.data);
    const totalPages = result.data.totalPages > 0 ? result.data.totalPages : 1;
    page += 1;
    if (page > totalPages) break;
  }

  return items;
};
