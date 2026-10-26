import { PROJECT_SORT_BY } from "../constants/projectList";
import {
  PROJECT_EXPORT_ALL_COLUMNS,
  type TProjectExportColumn,
  type TProjectExportFormat,
} from "../constants/projectExport";
import type { TGetProjectsParams } from "../types/project";

export type TProjectExportRequest = {
  format: TProjectExportFormat;
  layoutId?: string;
  title?: string;
  visibleColumns: TProjectExportColumn[];
  filters: TGetProjectsParams;
};

export const buildProjectExportSearchParams = (
  request: TProjectExportRequest,
) => {
  const params = new URLSearchParams();
  const { filters } = request;

  params.set("Format", String(request.format));
  params.set("SortBy", filters.sortBy ?? PROJECT_SORT_BY);
  params.set(
    "SortDescending",
    String(filters.sortDescending ?? true),
  );

  if (filters.search?.trim()) {
    params.set("Search", filters.search.trim());
  }
  if (filters.status !== undefined && filters.status !== "") {
    params.set("Status", String(filters.status));
  }
  if (filters.approvalStatus !== undefined && filters.approvalStatus !== "") {
    params.set("ApprovalStatus", String(filters.approvalStatus));
  }
  if (filters.projectType !== undefined && filters.projectType !== "") {
    params.set("ProjectType", String(filters.projectType));
  }
  if (filters.isActive !== undefined && filters.isActive !== "") {
    params.set("IsActive", String(filters.isActive));
  }
  if (filters.clientId !== undefined && filters.clientId !== "") {
    params.set("ClientId", String(filters.clientId));
  }

  if (request.layoutId?.trim()) {
    params.set("LayoutId", request.layoutId.trim());
  }

  const title = request.title?.trim();
  if (title) {
    params.set("Title", title);
  }

  const selected = new Set(request.visibleColumns);
  const allSelected =
    selected.size === PROJECT_EXPORT_ALL_COLUMNS.length &&
    PROJECT_EXPORT_ALL_COLUMNS.every((column) => selected.has(column));

  if (!allSelected) {
    for (const column of request.visibleColumns) {
      params.append("VisibleColumns", column);
    }
  }

  return params;
};
