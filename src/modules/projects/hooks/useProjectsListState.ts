import { useMemo, useState } from "react";
import {
  ProjectApprovalStatus,
  ProjectStatus,
  PROJECTS_PAGE_SIZE,
  PROJECT_SORT_BY,
  type TProjectQuickFilter,
} from "../constants/projectList";
import type { TGetProjectsParams } from "../types/project";

type DraftFilters = {
  search: string;
  status: number | "";
  approvalStatus: number | "";
  projectType: number | "";
  isActive: boolean | "";
  clientId: number | "";
};

const emptyDraft = (): DraftFilters => ({
  search: "",
  status: "",
  approvalStatus: "",
  projectType: "",
  isActive: "",
  clientId: "",
});

const filtersFromQuick = (quick: TProjectQuickFilter): DraftFilters => {
  const next = emptyDraft();
  if (quick === "active") next.isActive = true;
  if (quick === "pending") next.approvalStatus = ProjectApprovalStatus.Pending;
  if (quick === "draft") next.status = ProjectStatus.Draft;
  return next;
};

export const useProjectsListState = () => {
  const [draft, setDraft] = useState<DraftFilters>(emptyDraft);
  const [applied, setApplied] = useState<DraftFilters>(emptyDraft);
  const [quick, setQuick] = useState<TProjectQuickFilter>("all");
  const [page, setPage] = useState(1);

  const params: TGetProjectsParams = useMemo(
    () => ({
      page,
      pageSize: PROJECTS_PAGE_SIZE,
      sortBy: PROJECT_SORT_BY,
      sortDescending: true,
      ...(applied.search.trim() ? { search: applied.search.trim() } : {}),
      ...(applied.status !== "" ? { status: applied.status } : {}),
      ...(applied.approvalStatus !== ""
        ? { approvalStatus: applied.approvalStatus }
        : {}),
      ...(applied.projectType !== "" ? { projectType: applied.projectType } : {}),
      ...(applied.isActive !== "" ? { isActive: applied.isActive } : {}),
      ...(applied.clientId !== "" ? { clientId: applied.clientId } : {}),
    }),
    [applied, page],
  );

  const applyFilters = () => {
    setQuick("all");
    setApplied({ ...draft, search: draft.search.trim() });
    setPage(1);
  };

  const clearFilters = () => {
    const next = emptyDraft();
    setDraft(next);
    setApplied(next);
    setQuick("all");
    setPage(1);
  };

  const applyQuickFilter = (nextQuick: TProjectQuickFilter) => {
    const next = filtersFromQuick(nextQuick);
    setQuick(nextQuick);
    setDraft(next);
    setApplied(next);
    setPage(1);
  };

  const hasAppliedFilters =
    Boolean(applied.search.trim()) ||
    applied.status !== "" ||
    applied.approvalStatus !== "" ||
    applied.projectType !== "" ||
    applied.isActive !== "" ||
    applied.clientId !== "";

  return {
    draft,
    setDraft,
    applied,
    quick,
    page,
    setPage,
    pageSize: PROJECTS_PAGE_SIZE,
    params,
    applyFilters,
    clearFilters,
    applyQuickFilter,
    hasAppliedFilters,
  };
};
