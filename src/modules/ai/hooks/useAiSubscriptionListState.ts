import { useEffect, useMemo, useState } from "react";
import { useAppTablePagination } from "@/shared/ANTD_UIComponents/AppTable/useAppTablePagination";
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
  const [isManager, setIsManager] = useState<TriState>("all");
  const { page, pageSize, onChange, resetPage } = useAppTablePagination();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextSearch = searchInput.trim();
      setDebouncedSearch((previous) => {
        if (previous !== nextSearch) {
          resetPage();
        }
        return nextSearch;
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput, resetPage]);

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
    pagination: {
      page,
      pageSize,
      onChange,
    },
    isManager,
    setIsManager: (value: TriState) => {
      setIsManager(value);
      resetPage();
    },
    params,
  };
};

export type { TriState };
export { SEARCH_DEBOUNCE_MS };
