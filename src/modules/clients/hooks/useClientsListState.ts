import { useMemo, useState } from "react";
import { CLIENTS_PAGE_SIZE } from "../constants/clientList";
import type { TGetClientsParams } from "../types/client";

type DraftFilters = {
  search: string;
};

const emptyDraft = (): DraftFilters => ({
  search: "",
});

export const useClientsListState = () => {
  const [draft, setDraft] = useState<DraftFilters>(emptyDraft);
  const [applied, setApplied] = useState<DraftFilters>(emptyDraft);
  const [page, setPage] = useState(1);

  const params: TGetClientsParams = useMemo(
    () => ({
      page,
      pageSize: CLIENTS_PAGE_SIZE,
      ...(applied.search.trim() ? { search: applied.search.trim() } : {}),
    }),
    [applied, page],
  );

  const applyFilters = () => {
    setApplied({ search: draft.search.trim() });
    setPage(1);
  };

  const clearFilters = () => {
    const next = emptyDraft();
    setDraft(next);
    setApplied(next);
    setPage(1);
  };

  const hasAppliedFilters = Boolean(applied.search.trim());

  return {
    draft,
    setDraft,
    applied,
    page,
    setPage,
    pageSize: CLIENTS_PAGE_SIZE,
    params,
    applyFilters,
    clearFilters,
    hasAppliedFilters,
  };
};
