import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetReportLayouts } from "@/modules/reportLayout/api/hooks/useGetReportLayouts";
import type { TLayout } from "@/modules/reportLayout/types";
import { useExportClient } from "../api/hooks/useExportClient";
import { useGetLastUsedClientLayout } from "../api/hooks/useGetLastUsedClientLayout";
import {
  CLIENT_EXPORT_ALL_COLUMNS,
  CLIENT_EXPORT_ESSENTIAL_COLUMNS,
  ClientExportFormat,
  type TClientExportColumn,
  type TClientExportFormat,
} from "../constants/clientExport";
import type { TGetClientsParams } from "../types/client";
import { downloadClientExportBlob } from "../utils/clientExportDownload";

export const useExportClientsManager = (filters: TGetClientsParams) => {
  const { t } = useTranslation();
  const { isAdmin, isManager, hasPermission } = usePermissions();
  const canExport = hasPermission(PermissionsList.Client.Export);
  const canGetLayouts =
    isAdmin ||
    isManager ||
    hasPermission(PermissionsList.ReportLayout.GetLayouts);
  const canGetLastUsed =
    isAdmin ||
    isManager ||
    hasPermission(PermissionsList.ReportLayout.GetLastUsedLayout);

  const exportMutation = useExportClient();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<TClientExportFormat>(
    ClientExportFormat.Pdf,
  );
  const [layoutId, setLayoutId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [columns, setColumns] = useState<TClientExportColumn[]>([
    ...CLIENT_EXPORT_ALL_COLUMNS,
  ]);

  const layoutsQuery = useGetReportLayouts(
    false,
    open && canExport && canGetLayouts,
  );
  const lastUsedQuery = useGetLastUsedClientLayout(
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
    setFormat(ClientExportFormat.Pdf);
    setLayoutId("");
    setTitle("");
    setColumns([...CLIENT_EXPORT_ALL_COLUMNS]);
    setOpen(true);
  };

  const closeExport = () => {
    if (exportMutation.isPending) return;
    setOpen(false);
  };

  const selectAllColumns = () => {
    setColumns([...CLIENT_EXPORT_ALL_COLUMNS]);
  };

  const selectEssentialColumns = () => {
    setColumns([...CLIENT_EXPORT_ESSENTIAL_COLUMNS]);
  };

  const clearColumns = () => {
    setColumns([]);
  };

  const toggleColumn = (column: TClientExportColumn) => {
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
      toast.error(t("clients.export.columnsRequired"));
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
      toast.error(result.message || t("clients.export.failed"));
      return;
    }

    downloadClientExportBlob(result.blob, result.fileName);
    toast.success(t("clients.export.success"));
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
    layoutsLoading: layoutsQuery.isLoading,
    layoutsError:
      layoutsQuery.isError ||
      (layoutsQuery.data != null && !layoutsQuery.data.isSuccess),
    lastUsedName,
    lastUsedLoading: lastUsedQuery.isLoading,
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
