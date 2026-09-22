import { useMemo, useState, type CSSProperties } from "react";
import { Table } from "antd";
import clsx from "clsx";
import { SlidersHorizontal } from "lucide-react";
import AppChevron from "../AppChevron/AppChevron";
import "./appTableStyles.css";
import type { AppTableProps, IDataType } from "./Types/tableTypes";
import { Tablecolumns } from "./TableColumns";
import AppButton from "../AppButton/AppButton";
import { filterDataByColumnSearch } from "./columnSearchUtils";
import { applyColumnSort } from "./columnSortUtils";
import {
  createSkeletonDataSource,
  getSkeletonRowCount,
  isTableLoading,
  resolveTableColumns,
} from "./tableLoadingUtils";
import { useColumnHeaderSearch } from "./useColumnHeaderSearch";
import { useResizableColumns } from "./useResizableColumns";

const AppTable = <T extends IDataType = IDataType>({
  filterContent,
  filterPanelWidth = "20%",
  columns = Tablecolumns as AppTableProps<T>["columns"],
  dataSource = [] as T[],
  className,
  scroll = { x: "max-content", y: 55 * 8 },
  footerContent,
  loading,
  pagination: paginationProp,
  rowSelection,
  resizableColumns: resizableColumnsEnabled = true,
  columnHeaderSearch: columnHeaderSearchEnabled = false,
  components: userComponents,
  ...tableProps
}: AppTableProps<T>) => {
  const [isFilterOpen, setIsPreferenceOpen] = useState(false);
  const hasFilterPanel = Boolean(filterContent);
  const isLoading = isTableLoading(loading);

  const skeletonRowCount = useMemo(
    () => getSkeletonRowCount(scroll, paginationProp),
    [scroll, paginationProp],
  );

  const { columns: resizedColumns, components: resizableComponents } =
    useResizableColumns({
      columns,
      enabled: resizableColumnsEnabled,
      components: userComponents,
    });

  const { columns: searchableColumns, searchValues, sortStates } =
    useColumnHeaderSearch({
      columns: resizedColumns,
      enabled: columnHeaderSearchEnabled,
    });

  const displayColumns = useMemo(
    () => resolveTableColumns(searchableColumns, isLoading),
    [searchableColumns, isLoading],
  );

  const filteredDataSource = useMemo(() => {
    if (!columnHeaderSearchEnabled) return dataSource;

    const searched = filterDataByColumnSearch(dataSource, columns, searchValues);
    return applyColumnSort(searched, columns, sortStates);
  }, [
    columnHeaderSearchEnabled,
    dataSource,
    columns,
    searchValues,
    sortStates,
  ]);

  const displayDataSource = useMemo(
    () =>
      isLoading
        ? createSkeletonDataSource<T>(skeletonRowCount)
        : filteredDataSource,
    [isLoading, filteredDataSource, skeletonRowCount],
  );

  const displayRowSelection = useMemo(() => {
    if (!rowSelection || !isLoading) return rowSelection;

    const { getCheckboxProps, ...rest } = rowSelection;

    return {
      ...rest,
      getCheckboxProps: (record: T) => ({
        ...getCheckboxProps?.(record),
        disabled: true,
      }),
    };
  }, [rowSelection, isLoading]);

  return (
    <div className="flex w-full h-fit relative">
      {hasFilterPanel && (
        <div
          className={clsx(
            "shrink-0 self-start overflow-hidden transition-[width] duration-300 ease-in-out",
            isFilterOpen ? "h-fit" : "h-0",
          )}
          style={{ width: isFilterOpen ? filterPanelWidth : 0 }}
          aria-hidden={!isFilterOpen}
        >
          <div
            className={clsx(
              "h-fit overflow-y-auto border-r border-(--Grey200) p-4 transition-transform duration-300 ease-in-out",
              isFilterOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            {filterContent}
          </div>
        </div>
      )}

      <div
        className="relative z-10 min-w-0 shrink-0 transition-[width] duration-300 ease-in-out"
        style={
          {
            height: "fit-content",
            width:
              hasFilterPanel && isFilterOpen
                ? `calc(100% - ${filterPanelWidth})`
                : "100%",
          } satisfies CSSProperties
        }
      >
        <div className="flex h-fit py-1 items-center justify-start pr-2">
          {hasFilterPanel && (
            <AppButton
              variant="secondary"
              icon={<SlidersHorizontal size={16} />}
              aria-expanded={isFilterOpen}
              onClick={() => setIsPreferenceOpen((open) => !open)}
            >
              Table Filters
            </AppButton>
          )}
        </div>

        <Table<T>
          {...tableProps}
          className={clsx("app-table", className)}
          components={resizableComponents}
          columns={displayColumns}
          tableLayout={tableProps.tableLayout ?? "fixed"}
          dataSource={displayDataSource}
          rowSelection={displayRowSelection}
          scroll={scroll}
          pagination={
            paginationProp === false
              ? false
              : {
                  hideOnSinglePage: false,
                  position: ["bottomRight"],
                  showQuickJumper: true,
                  nextIcon: (
                    <AppChevron
                      direction="next"
                      size={35}
                      className="bg-white p-1 rounded-lg border border-(--Grey200)"
                    />
                  ),
                  prevIcon: (
                    <AppChevron
                      direction="previous"
                      size={35}
                      className="bg-white p-1 rounded-lg border border-(--Grey200)"
                    />
                  ),
                  ...paginationProp,
                }
          }
        />
      </div>
      {footerContent && (
        <div className="absolute bottom-5 left-3 z-10">{footerContent}</div>
      )}
    </div>
  );
};

export default AppTable;
