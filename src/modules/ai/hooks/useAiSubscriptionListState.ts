import { useEffect, useMemo, useState } from "react";
import type { TGetAiSubscriptionsParams } from "../types";

type TriState = "all" | "true" | "false";

const toBooleanFilter = (value: TriState): boolean | undefined => {
  if (value === "all") {
    return undefined;
  }

  return value === "true";
};

const SEARCH_DEBOUNCE_MS = 300;

export const useAiSubscriptionListState = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isManager, setIsManager] = useState<TriState>("all");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();
      setDebouncedSearch((previous) => {
        if (previous !== nextSearch) {
          setPage(1);
        }
        return nextSearch;
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const params: TGetAiSubscriptionsParams = useMemo(
    () => ({
      page,
      pageSize,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(toBooleanFilter(isManager) !== undefined
        ? { isManager: toBooleanFilter(isManager) }
        : {}),
    }),
    [page, pageSize, debouncedSearch, isManager],
  );

  return {
    searchInput,
    setSearchInput,
    page,
    setPage,
    pageSize,
    setPageSize,
    isManager,
    setIsManager: (value: TriState) => {
      setIsManager(value);
      setPage(1);
    },
    params,
  };
};

export type { TriState };
export { SEARCH_DEBOUNCE_MS };
