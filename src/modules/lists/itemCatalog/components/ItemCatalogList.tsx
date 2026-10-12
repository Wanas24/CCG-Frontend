import { Input, Pagination, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Lock, Package, SearchX } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useGetMeasurements } from "../../units/api/hooks/useGetMeasurements";
import { useGetItemCategories } from "../api/hooks/useGetItemCategories";
import { useGetItemCategoryTypes } from "../api/hooks/useGetItemCategoryTypes";
import { useItemCatalogListState } from "../hooks/useItemCatalogListState";
import { useItemCatalogManager } from "../hooks/useItemCatalogManager";
import ItemCatalogBoard from "./ItemCatalogBoard";
import ItemCatalogContentSkeleton from "./ItemCatalogContentSkeleton";
import ItemCatalogTypeLegend from "./ItemCatalogTypeLegend";
import ItemCategoryDrawer from "./ItemCategoryDrawer";
import {
  ItemCategoryDeleteDialog,
  ItemCategoryFileDeleteDialog,
} from "./ItemCatalogDialogs";

type Props = {
  className?: string;
};

const ItemCatalogList = ({ className }: Props) => {
  const { t } = useTranslation();
  const listState = useItemCatalogListState();
  const manager = useItemCatalogManager();

  const categoriesQuery = useGetItemCategories(
    listState.params,
    manager.canGet,
  );
  const mixQuery = useGetItemCategories(listState.mixParams, manager.canGet);
  const typesQuery = useGetItemCategoryTypes(manager.canGet);
  const unitsQuery = useGetMeasurements(
    { page: 1, pageSize: 100 },
    manager.canGet || manager.canCreate || manager.canEdit,
  );

  const pageData = categoriesQuery.data?.isSuccess
    ? categoriesQuery.data.data
    : undefined;
  const items = pageData?.data ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const mixItems =
    mixQuery.data?.isSuccess && Array.isArray(mixQuery.data.data?.data)
      ? mixQuery.data.data.data
      : [];
  const mixTotalCount = mixQuery.data?.isSuccess
    ? (mixQuery.data.data?.totalCount ?? mixItems.length)
    : 0;
  const types =
    typesQuery.data?.isSuccess && Array.isArray(typesQuery.data.data)
      ? typesQuery.data.data
      : [];
  const units =
    unitsQuery.data?.isSuccess && Array.isArray(unitsQuery.data.data?.data)
      ? unitsQuery.data.data.data
      : [];

  const isResultsError =
    categoriesQuery.isError ||
    Boolean(categoriesQuery.data && !categoriesQuery.data.isSuccess);
  const isInitialLoading =
    categoriesQuery.isPending && categoriesQuery.data === undefined;

  const renderBoard = () => {
    if (isResultsError) {
      return (
        <div className="flex flex-col gap-3">
          <AppErrorContainer
            error={
              categoriesQuery.data?.message ?? t("lists.itemCatalog.loadError")
            }
          />
          <AppButton
            variant="secondary"
            loading={categoriesQuery.isFetching}
            onClick={() => {
              void categoriesQuery.refetch();
            }}
            className="w-fit!"
          >
            {t("lists.itemCatalog.retry")}
          </AppButton>
        </div>
      );
    }

    if (isInitialLoading) {
      return <ItemCatalogContentSkeleton showLegend={false} />;
    }

    if (types.length === 0 && items.length === 0) {
      return (
        <AppEmptyState
          icon={
            listState.hasFilters ? (
              <SearchX size={DesignTokens.media.iconMd} />
            ) : (
              <Package size={DesignTokens.media.iconMd} />
            )
          }
          title={
            listState.hasFilters
              ? t("lists.itemCatalog.emptySearchTitle")
              : t("lists.itemCatalog.emptyTitle")
          }
          description={
            listState.hasFilters
              ? t("lists.itemCatalog.emptySearchDescription")
              : t("lists.itemCatalog.emptyDescription")
          }
          action={
            !listState.hasFilters && manager.canCreate ? (
              <AppButton
                onClick={() => manager.openCreate()}
                disabled={units.length === 0}
                title={
                  units.length === 0
                    ? t("lists.itemCatalog.needUnit")
                    : undefined
                }
              >
                {t("lists.itemCatalog.newItem")}
              </AppButton>
            ) : undefined
          }
        />
      );
    }

    return (
      <>
        <ItemCatalogBoard
          types={types}
          items={items}
          activeType={listState.type}
          canDelete={manager.canDelete}
          canCreate={manager.canCreate}
          onOpen={manager.openEdit}
          onDelete={manager.openDelete}
          onAdd={(type) => manager.openCreate(type)}
        />

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
    );
  };

  const renderResults = () => {
    if (types.length === 0 && isInitialLoading) {
      return <ItemCatalogContentSkeleton />;
    }

    return (
      <>
        {types.length > 0 ? (
          <ItemCatalogTypeLegend
            types={types}
            items={mixItems}
            totalCount={mixTotalCount}
            activeType={listState.type}
            onSelectType={listState.setType}
          />
        ) : null}
        {renderBoard()}
      </>
    );
  };

  if (manager.isPermissionsLoading) {
    return (
      <div className={["min-w-0", className].filter(Boolean).join(" ")}>
        <ItemCatalogContentSkeleton />
      </div>
    );
  }

  if (!manager.canGet) {
    return (
      <div className={className}>
        <AppEmptyState
          icon={<Lock size={DesignTokens.media.iconMd} />}
          title={t("lists.itemCatalog.emptyNoAccessTitle")}
          description={t("lists.itemCatalog.emptyNoAccessDescription")}
        />
      </div>
    );
  }

  return (
    <div className={["min-w-0", className].filter(Boolean).join(" ")}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <Input
          allowClear
          value={listState.searchInput}
          onChange={(event) => listState.setSearchInput(event.target.value)}
          placeholder={t("lists.itemCatalog.searchPlaceholder")}
          aria-label={t("lists.itemCatalog.searchPlaceholder")}
          className="w-full! lg:max-w-xs!"
        />
        <Select
          allowClear
          value={listState.unitId}
          onChange={(value) =>
            listState.setUnitId(typeof value === "number" ? value : undefined)
          }
          placeholder={t("lists.itemCatalog.unitFilter")}
          aria-label={t("lists.itemCatalog.unitFilter")}
          className="w-full! lg:w-48!"
          options={units.map((unit) => ({
            value: unit.id,
            label: unit.unit,
          }))}
          showSearch
          optionFilterProp="label"
        />
        {manager.canCreate ? (
          <AppButton
            onClick={() => manager.openCreate()}
            disabled={units.length === 0}
            title={
              units.length === 0 ? t("lists.itemCatalog.needUnit") : undefined
            }
            className="w-full! lg:w-fit!"
          >
            {t("lists.itemCatalog.newItem")}
          </AppButton>
        ) : null}
      </div>

      
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h2 className="m-0 text-sm font-semibold text-(--app-text)">
            {t("lists.itemCatalog.title")}
          </h2>
          <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
            {mixTotalCount || totalCount}
          </span>
          {listState.type !== undefined || listState.hasFilters ? (
            <span className={`text-xs ${DesignTokens.typography.muted}`}>
              {t("lists.itemCatalog.shownCount", { count: items.length })}
            </span>
          ) : (
            <span className={`text-xs ${DesignTokens.typography.muted}`}>
              {t("lists.itemCatalog.hint")}
            </span>
          )}
        </div>

        {renderResults()}
      

      <ItemCategoryDrawer
        open={manager.drawerOpen}
        form={manager.form}
        editingItem={manager.editingItem}
        activeItemId={manager.activeItemId}
        types={types}
        units={units}
        canEdit={manager.canEdit}
        canCreate={manager.canCreate}
        canDelete={manager.canDelete}
        canGetFiles={manager.canGetFiles}
        canUpload={manager.canUpload}
        canDownload={manager.canDownload}
        canDeleteFile={manager.canDeleteFile}
        isSaving={manager.isSaving}
        isUploading={manager.isUploading}
        fileAction={manager.fileAction}
        onSubmit={manager.submitItem}
        onClose={manager.closeDrawer}
        onDelete={() => {
          if (manager.editingItem) {
            manager.openDelete(manager.editingItem);
          }
        }}
        onUpload={(files) => {
          void manager.uploadFiles(files);
        }}
        onView={(file) => {
          void manager.viewFile(file);
        }}
        onDownload={(file) => {
          void manager.downloadFile(file);
        }}
        onDeleteFile={manager.openDeleteFile}
      />

      <ItemCategoryDeleteDialog
        item={manager.deletingItem}
        loading={manager.isDeleting}
        onConfirm={() => {
          void manager.confirmDelete();
        }}
        onClose={manager.closeDelete}
      />
      <ItemCategoryFileDeleteDialog
        file={manager.deletingFile}
        loading={manager.isDeletingFile}
        onConfirm={() => {
          void manager.confirmDeleteFile();
        }}
        onClose={manager.closeDeleteFile}
      />
    </div>
  );
};

export default ItemCatalogList;
