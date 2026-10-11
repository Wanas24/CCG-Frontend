import { Input, Pagination } from "antd";
import { useTranslation } from "react-i18next";
import { Plus, Ruler, SearchX } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useGetMeasurements } from "../api/hooks/useGetMeasurements";
import { useUnitsListState } from "../hooks/useUnitsListState";
import { useUnitsManager } from "../hooks/useUnitsManager";
import type { TMeasurement } from "../types/measurement";
import UnitCard from "./UnitCard";
import { UnitDeleteDialog, UnitFormDrawer } from "./UnitDialogs";
import UnitsListSkeleton from "./UnitsListSkeleton";

export type UnitsListMode = "manage" | "select";

export type UnitsListProps = {
  mode?: UnitsListMode;
  selectedId?: number | null;
  onSelect?: (unit: TMeasurement) => void;
  enabled?: boolean;
  className?: string;
};

const UnitAddCard = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    className="flex min-h-28 min-w-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-(--Grey300) bg-transparent px-3 py-4 text-center text-sm font-semibold text-(--Grey600) transition hover:border-(--Primary400) hover:bg-(--Primary100)/40 hover:text-(--app-text)"
    onClick={onClick}
  >
    <Plus size={16} className="shrink-0" />
    <span className="min-w-0 truncate">{label}</span>
  </button>
);

const UnitsList = ({
  mode = "manage",
  selectedId = null,
  onSelect,
  enabled = true,
  className,
}: UnitsListProps) => {
  const { t } = useTranslation();
  const listState = useUnitsListState();
  const manager = useUnitsManager();
  const { data, isPending, isError, isFetching, refetch } = useGetMeasurements(
    listState.params,
    enabled,
  );

  const pageData = data?.isSuccess ? data.data : undefined;
  const rows = pageData?.data ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const showCreateAction = mode === "manage" && manager.canCreate;
  const showGrid = rows.length > 0 || (showCreateAction && !listState.hasSearch);

  return (
    <div className={className}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          allowClear
          value={listState.searchInput}
          onChange={(event) => listState.setSearchInput(event.target.value)}
          placeholder={t("lists.units.searchPlaceholder")}
          aria-label={t("lists.units.searchPlaceholder")}
          className="w-full! sm:max-w-md!"
        />
        {showCreateAction ? (
          <AppButton
            onClick={manager.openCreate}
            className="w-full! sm:w-fit!"
          >
            {t("lists.units.add")}
          </AppButton>
        ) : null}
      </div>

     
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h2 className="m-0 text-sm font-semibold text-(--app-text)">
            {t("lists.units.title")}
          </h2>
          <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
            {totalCount}
          </span>
          <span className={`text-xs ${DesignTokens.typography.muted}`}>
            {t("lists.units.hint")}
          </span>
        </div>

        {isError || (data && !data.isSuccess) ? (
          <div className="flex flex-col gap-3">
            <AppErrorContainer
              error={data?.message ?? t("lists.units.loadError")}
            />
            <AppButton
              variant="secondary"
              loading={isFetching}
              onClick={() => {
                void refetch();
              }}
              className="w-fit!"
            >
              {t("lists.units.retry")}
            </AppButton>
          </div>
        ) : isPending ? (
          <UnitsListSkeleton />
        ) : !showGrid ? (
          <AppEmptyState
            icon={
              listState.hasSearch ? (
                <SearchX size={DesignTokens.media.iconMd} />
              ) : (
                <Ruler size={DesignTokens.media.iconMd} />
              )
            }
            title={
              listState.hasSearch
                ? t("lists.units.emptySearchTitle")
                : t("lists.units.emptyTitle")
            }
            description={
              listState.hasSearch
                ? t("lists.units.emptySearchDescription")
                : t("lists.units.emptyDescription")
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {rows.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  mode={mode}
                  selected={selectedId === unit.id}
                  canEdit={manager.canEdit}
                  canDelete={manager.canDelete}
                  onEdit={manager.openEdit}
                  onDelete={manager.openDelete}
                  onSelect={onSelect}
                />
              ))}
              {showCreateAction ? (
                <UnitAddCard
                  label={t("lists.units.add")}
                  onClick={manager.openCreate}
                />
              ) : null}
            </div>
            {totalCount > listState.pagination.pageSize ? (
              <div className="flex justify-end">
                <Pagination
                  current={listState.pagination.page}
                  pageSize={listState.pagination.pageSize}
                  total={totalCount}
                  showSizeChanger
                  onChange={listState.pagination.onChange}
                />
              </div>
            ) : null}
          </>
        )}
      

      {mode === "manage" ? (
        <>
          <UnitFormDrawer
            open={manager.drawerOpen}
            form={manager.form}
            editingUnit={manager.editingUnit}
            loading={manager.isSaving}
            onSubmit={manager.submitUnit}
            onClose={manager.closeDrawer}
          />
          <UnitDeleteDialog
            unit={manager.deletingUnit}
            loading={manager.isDeleting}
            onConfirm={() => {
              void manager.confirmDelete();
            }}
            onClose={manager.closeDelete}
          />
        </>
      ) : null}
    </div>
  );
};

export default UnitsList;
