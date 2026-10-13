import { useEffect, useMemo, useState } from "react";
import type { TAlertUiStatus, TGetMyAlertsParams } from "../types";

export type AlertsViewMode = "board" | "timeline";

const SEARCH_DEBOUNCE_MS = 300;
const BOARD_PAGE_SIZE = 100;

export const useAlertsListState = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState<AlertsViewMode>("board");
  const [focusedStatus, setFocusedStatus] = useState<TAlertUiStatus | "all">(
    "all",
  );
  const [mineOnly, setMineOnly] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const toggleFocusedStatus = (status: TAlertUiStatus) => {
    setFocusedStatus((previous) => (previous === status ? "all" : status));
  };

  const params: TGetMyAlertsParams = useMemo(
    () => ({
      page: 1,
      pageSize: BOARD_PAGE_SIZE,
      liveOnly: false,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [debouncedSearch],
  );

  return {
    searchInput,
    setSearchInput,
    hasSearch: Boolean(debouncedSearch),
    viewMode,
    setViewMode,
    focusedStatus,
    toggleFocusedStatus,
    clearFocusedStatus: () => setFocusedStatus("all"),
    mineOnly,
    setMineOnly,
    params,
  };
};
