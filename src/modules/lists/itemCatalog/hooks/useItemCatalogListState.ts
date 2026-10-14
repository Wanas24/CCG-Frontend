import { useEffect, useMemo, useState } from "react";
import { useAppTablePagination } from "@/shared/ANTD_UIComponents/AppTable/useAppTablePagination";
import type { TGetItemCategoriesParams } from "../types/itemCategory";

const SEARCH_DEBOUNCE_MS = 300;
const MIX_PAGE_SIZE = 100;

export const useItemCatalogListState = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [unitId, setUnitId] = useState<number | undefined>(undefined);
  const [type, setType] = useState<number | undefined>(undefined);
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

  const sharedFilters = useMemo(
    () => ({
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      ...(unitId !== undefined ? { unitId } : {}),
    }),
    [debouncedSearch, unitId],
  );

  const params: TGetItemCategoriesParams = useMemo(
    () => ({
      page,
      pageSize,
      ...sharedFilters,
      ...(type !== undefined ? { type } : {}),
    }),
    [page, pageSize, sharedFilters, type],
  );

  const mixParams: TGetItemCategoriesParams = useMemo(
    () => ({
      page: 1,
      pageSize: MIX_PAGE_SIZE,
    }),
    [],
  );

  return {
    searchInput,
    setSearchInput,
    unitId,
    setUnitId: (value: number | undefined) => {
      setUnitId(value);
      resetPage();
    },
    type,
    setType: (value: number | undefined) => {
      setType(value);
      resetPage();
    },
    hasFilters: Boolean(
      debouncedSearch || unitId !== undefined || type !== undefined,
    ),
    pagination: {
      page,
      pageSize,
      onChange,
    },
    params,
    mixParams,
  };
};
