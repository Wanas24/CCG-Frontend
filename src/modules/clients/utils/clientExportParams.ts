import {
  CLIENT_EXPORT_ALL_COLUMNS,
  type TClientExportColumn,
  type TClientExportFormat,
} from "../constants/clientExport";
import type { TGetClientsParams } from "../types/client";

export type TClientExportRequest = {
  format: TClientExportFormat;
  layoutId?: string;
  title?: string;
  visibleColumns: TClientExportColumn[];
  filters: TGetClientsParams;
};

export const buildClientExportSearchParams = (
  request: TClientExportRequest,
) => {
  const params = new URLSearchParams();
  const { filters } = request;

  params.set("Format", String(request.format));

  if (filters.search?.trim()) {
    params.set("Search", filters.search.trim());
  }

  if (filters.id != null && Number.isFinite(filters.id) && filters.id > 0) {
    params.set("Id", String(filters.id));
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
    selected.size === CLIENT_EXPORT_ALL_COLUMNS.length &&
    CLIENT_EXPORT_ALL_COLUMNS.every((column) => selected.has(column));

  if (!allSelected) {
    for (const column of request.visibleColumns) {
      params.append("VisibleColumns", column);
    }
  }

  return params;
};
