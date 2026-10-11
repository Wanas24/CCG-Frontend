import { useEffect, useMemo, useState } from "react";
import { useAppTablePagination } from "@/shared/ANTD_UIComponents/AppTable/useAppTablePagination";
import type { TGetMeasurementsParams } from "../types/measurement";

const SEARCH_DEBOUNCE_MS = 300;

export const useUnitsListState = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { page, pageSize, onChange, resetPage } = useAppTablePagination(20);

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

  const params: TGetMeasurementsParams = useMemo(
    () => ({
      page,
      pageSize,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [page, pageSize, debouncedSearch],
  );

  return {
    searchInput,
    setSearchInput,
    hasSearch: Boolean(debouncedSearch),
    pagination: {
      page,
      pageSize,
      onChange,
    },
    params,
  };
};
