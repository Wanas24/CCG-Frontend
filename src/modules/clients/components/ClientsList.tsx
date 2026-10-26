import { Pagination } from "antd";
import { Download, Search, SearchX, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppInput } from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useGetClients } from "../api/hooks/useGetClients";
import { useClientsListState } from "../hooks/useClientsListState";
import { useExportClientsManager } from "../hooks/useExportClientsManager";
import ClientCard from "./ClientCard";
import ClientExportDialog from "./ClientExportDialog";
import ClientsListSkeleton from "./ClientsListSkeleton";

const ClientsList = () => {
  const { t } = useTranslation();
  const listState = useClientsListState();
  const exportManager = useExportClientsManager(listState.params);
  const { data, isPending, isError, isFetching, refetch } = useGetClients(
    listState.params,
  );

  const pageData = data?.isSuccess ? data.data : undefined;
  const rows = pageData?.data ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / listState.pageSize));

  const showFilteredEmpty =
    !isPending &&
    !isError &&
    !(data && !data.isSuccess) &&
    rows.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AppInput
            label={t("clients.filters.search")}
            value={listState.draft.search}
            onChange={(event) =>
              listState.setDraft((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            onPressEnter={listState.applyFilters}
            placeholder={t("clients.searchPlaceholder")}
            prefix={<Search size={16} className="text-(--Grey500)" />}
            allowClear
            aria-label={t("clients.searchPlaceholder")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <AppButton onClick={listState.applyFilters} className="w-fit!">
            {t("clients.apply")}
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={listState.clearFilters}
            className="w-fit!"
          >
            {t("clients.clear")}
          </AppButton>
          {exportManager.canExport ? (
            <AppButton
              variant="secondary"
              className="w-fit!"
              icon={<Download size={16} />}
              onClick={exportManager.openExport}
            >
              {t("clients.export.action")}
            </AppButton>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-sm font-semibold text-(--app-text)">
          {t("clients.title")}
        </h2>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
          {t("clients.matchCount", { count: totalCount })}
        </span>
      </div>

      {isError || (data && !data.isSuccess) ? (
        <div className="flex flex-col gap-3">
          <AppErrorContainer
            error={data?.message ?? t("clients.loadError")}
          />
          <AppButton
            variant="secondary"
            loading={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="w-fit!"
          >
            {t("clients.retry")}
          </AppButton>
        </div>
      ) : isPending ? (
        <ClientsListSkeleton />
      ) : showFilteredEmpty ? (
        <AppEmptyState
          icon={
            listState.hasAppliedFilters ? (
              <SearchX size={DesignTokens.media.iconMd} />
            ) : (
              <Users size={DesignTokens.media.iconMd} />
            )
          }
          title={
            listState.hasAppliedFilters
              ? t("clients.emptySearchTitle")
              : t("clients.emptyTitle")
          }
          description={
            listState.hasAppliedFilters
              ? t("clients.emptySearchDescription")
              : t("clients.emptyDescription")
          }
        />
      ) : (
        <>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-busy={isFetching || undefined}
          >
            {rows.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
          {totalCount > listState.pageSize ? (
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`m-0 text-xs ${DesignTokens.typography.muted}`}>
                {t("clients.pageLabel", {
                  page: listState.page,
                  total: totalPages,
                })}
              </p>
              <Pagination
                current={listState.page}
                pageSize={listState.pageSize}
                total={totalCount}
                showSizeChanger={false}
                onChange={(nextPage) => listState.setPage(nextPage)}
              />
            </div>
          ) : null}
        </>
      )}

      {exportManager.canExport ? (
        <ClientExportDialog
          open={exportManager.open}
          loading={exportManager.isExporting}
          layoutsLoading={exportManager.layoutsLoading}
          layoutsError={exportManager.layoutsError}
          lastUsedLoading={exportManager.lastUsedLoading}
          format={exportManager.format}
          layoutId={exportManager.layoutId}
          title={exportManager.title}
          columns={exportManager.columns}
          layouts={exportManager.layouts}
          lastUsedName={exportManager.lastUsedName}
          selectedLayout={exportManager.selectedLayout}
          onFormatChange={exportManager.setFormat}
          onLayoutChange={exportManager.setLayoutId}
          onTitleChange={exportManager.setTitle}
          onToggleColumn={exportManager.toggleColumn}
          onSelectAllColumns={exportManager.selectAllColumns}
          onSelectEssentialColumns={exportManager.selectEssentialColumns}
          onClearColumns={exportManager.clearColumns}
          onSubmit={() => {
            void exportManager.submitExport();
          }}
          onClose={exportManager.closeExport}
        />
      ) : null}
    </div>
  );
};

export default ClientsList;
