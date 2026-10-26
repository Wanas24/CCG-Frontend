import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetReportLayouts } from "@/modules/reportLayout/api/hooks/useGetReportLayouts";
import type { TLayout } from "@/modules/reportLayout/types";
import { useExportProject } from "../api/hooks/useExportProject";
import { useGetLastUsedProjectLayout } from "../api/hooks/useGetLastUsedProjectLayout";
import {
  PROJECT_EXPORT_ALL_COLUMNS,
  PROJECT_EXPORT_ESSENTIAL_COLUMNS,
  ProjectExportFormat,
  type TProjectExportColumn,
  type TProjectExportFormat,
} from "../constants/projectExport";
import type { TGetProjectsParams } from "../types/project";
import { downloadProjectExportBlob } from "../utils/projectExportDownload";

export const useExportProjectsManager = (filters: TGetProjectsParams) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canExport = hasPermission(PermissionsList.Project.Export);
  const canGetLayouts = hasPermission(PermissionsList.ReportLayout.GetLayouts);
  const canGetLastUsed = hasPermission(
    PermissionsList.ReportLayout.GetLastUsedLayout,
  );

  const exportMutation = useExportProject();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<TProjectExportFormat>(
    ProjectExportFormat.Pdf,
  );
  const [layoutId, setLayoutId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [columns, setColumns] = useState<TProjectExportColumn[]>([
    ...PROJECT_EXPORT_ALL_COLUMNS,
  ]);

  const layoutsQuery = useGetReportLayouts(
    false,
    open && canExport && canGetLayouts,
  );
  const lastUsedQuery = useGetLastUsedProjectLayout(
    open && canExport && canGetLastUsed,
  );

  const layouts = useMemo(() => {
    const rows = layoutsQuery.data?.isSuccess
      ? (layoutsQuery.data.data ?? [])
      : [];
    return rows.filter((layout) => layout.isActive !== false);
  }, [layoutsQuery.data]);

  const lastUsedName =
    lastUsedQuery.data?.status === "found"
      ? lastUsedQuery.data.layout.name
      : null;

  const openExport = () => {
    if (!canExport) return;
    setFormat(ProjectExportFormat.Pdf);
    setLayoutId("");
    setTitle("");
    setColumns([...PROJECT_EXPORT_ALL_COLUMNS]);
    setOpen(true);
  };

  const closeExport = () => {
    if (exportMutation.isPending) return;
    setOpen(false);
  };

  const selectAllColumns = () => {
    setColumns([...PROJECT_EXPORT_ALL_COLUMNS]);
  };

  const selectEssentialColumns = () => {
    setColumns([...PROJECT_EXPORT_ESSENTIAL_COLUMNS]);
  };

  const clearColumns = () => {
    setColumns([]);
  };

  const toggleColumn = (column: TProjectExportColumn) => {
    setColumns((current) =>
      current.includes(column)
        ? current.filter((item) => item !== column)
        : [...current, column],
    );
  };

  const selectedLayout: TLayout | null =
    layouts.find((layout) => layout.id === layoutId) ?? null;

  const submitExport = async () => {
    if (!canExport || exportMutation.isPending) return;
    if (columns.length === 0) {
      toast.error(t("projects.export.columnsRequired"));
      return;
    }

    const result = await exportMutation.mutateAsync({
      format,
      layoutId: layoutId || undefined,
      title,
      visibleColumns: columns,
      filters,
    });

    if (!result.ok) {
      toast.error(result.message || t("projects.export.failed"));
      return;
    }

    downloadProjectExportBlob(result.blob, result.fileName);
    toast.success(t("projects.export.success"));
    setOpen(false);
  };

  return {
    canExport,
    open,
    format,
    setFormat,
    layoutId,
    setLayoutId,
    title,
    setTitle,
    columns,
    layouts,
    layoutsLoading: layoutsQuery.isPending,
    layoutsError:
      layoutsQuery.isError ||
      (layoutsQuery.data != null && !layoutsQuery.data.isSuccess),
    lastUsedName,
    lastUsedLoading: lastUsedQuery.isPending,
    selectedLayout,
    isExporting: exportMutation.isPending,
    openExport,
    closeExport,
    selectAllColumns,
    selectEssentialColumns,
    clearColumns,
    toggleColumn,
    submitExport,
  };
};
