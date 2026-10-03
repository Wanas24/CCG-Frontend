import { useMemo, useState, type CSSProperties } from "react";
import { Table, type TablePaginationConfig } from "antd";
import clsx from "clsx";
import { SlidersHorizontal } from "lucide-react";
import AppChevron from "../AppChevron/AppChevron";
import "./appTableStyles.css";
import type {
  AppTableProps,
  AppTableServerPagination,
  IDataType,
} from "./Types/tableTypes";
import { Tablecolumns } from "./TableColumns";
import AppButton from "../AppButton/AppButton";
import { filterDataByColumnSearch } from "./columnSearchUtils";
import { applyColumnSort } from "./columnSortUtils";
import { useColumnHeaderSearch } from "./useColumnHeaderSearch";
import { useResizableColumns } from "./useResizableColumns";

const PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"];

const toControlledPagination = (
  serverPagination: AppTableServerPagination,
) => ({
  current: serverPagination.page,
  pageSize: serverPagination.pageSize,
  total: serverPagination.total,
  onChange: (nextPage: number, nextPageSize: number) => {
    const pageSizeChanged = nextPageSize !== serverPagination.pageSize;
    serverPagination.onChange(pageSizeChanged ? 1 : nextPage, nextPageSize);
  },
});

const AppTable = <T extends object = IDataType>({
  filterContent,
  filterPanelWidth = "20%",
  columns = Tablecolumns as AppTableProps<T>["columns"],
  dataSource = [] as T[],
  className,
  scroll,
  footerContent,
  loading,
  pagination: paginationProp,
  serverPagination,
  rowSelection,
  resizableColumns: resizableColumnsEnabled = true,
  columnHeaderSearch: columnHeaderSearchEnabled = false,
  components: userComponents,
  ...tableProps
}: AppTableProps<T>) => {
  const [isFilterOpen, setIsPreferenceOpen] = useState(false);
  const hasFilterPanel = Boolean(filterContent);

  const paginationConfig: TablePaginationConfig | false =
    paginationProp === false
      ? false
      : {
          hideOnSinglePage: false,
          position: ["bottomRight"],
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
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
          ...(serverPagination ? toControlledPagination(serverPagination) : {}),
        };

  const { columns: resizedColumns, components: resizableComponents } =
    useResizableColumns({
      columns,
      enabled: resizableColumnsEnabled,
      components: userComponents,
    });

  const {
    columns: searchableColumns,
    searchValues,
    sortStates,
  } = useColumnHeaderSearch({
    columns: resizedColumns,
    enabled: columnHeaderSearchEnabled,
  });

  const filteredDataSource = useMemo(() => {
    if (!columnHeaderSearchEnabled) return dataSource;

    const searched = filterDataByColumnSearch(
      dataSource,
      columns,
      searchValues,
    );
    return applyColumnSort(searched, columns, sortStates);
  }, [
    columnHeaderSearchEnabled,
    dataSource,
    columns,
    searchValues,
    sortStates,
  ]);

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
        {hasFilterPanel && (
          <div className="flex h-fit py-1 items-center justify-start pr-2">
            <AppButton
              variant="secondary"
              icon={<SlidersHorizontal size={16} />}
              aria-expanded={isFilterOpen}
              onClick={() => setIsPreferenceOpen((open) => !open)}
            >
              Table Filters
            </AppButton>
          </div>
        )}

        <Table<T>
          {...tableProps}
          className={clsx("app-table", className)}
          components={resizableComponents}
          columns={searchableColumns}
          tableLayout={tableProps.tableLayout ?? "fixed"}
          dataSource={filteredDataSource}
          rowSelection={rowSelection}
          loading={loading}
          scroll={scroll}
          pagination={paginationConfig}
        />
      </div>
      {footerContent && (
        <div className="absolute bottom-5 left-3 z-10">{footerContent}</div>
      )}
    </div>
  );
};

export default AppTable;
