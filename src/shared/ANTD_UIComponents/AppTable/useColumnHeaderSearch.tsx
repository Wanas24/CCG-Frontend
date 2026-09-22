import { useCallback, useMemo, useState } from "react";
import type { TableColumnsType } from "antd";
import type { ColumnType } from "antd/es/table";
import type { ReactNode } from "react";
import ColumnSearchHeader from "./ColumnSearchHeader";
import { getColumnKey, hasChildColumns } from "./columnUtils";
import { isSearchableColumn } from "./columnSearchUtils";
import {
  getNextColumnSortOrder,
  type ColumnSortState,
} from "./columnSortUtils";
import type { AppTableColumnType } from "./Types/tableTypes";

type UseColumnHeaderSearchOptions<T> = {
  columns: TableColumnsType<T> | undefined;
  enabled?: boolean;
};

function mapSearchableColumns<T>(
  columns: TableColumnsType<T>,
  activeSearchColumns: Set<string>,
  searchValues: Record<string, string>,
  sortStates: ColumnSortState,
  onToggle: (key: string) => void,
  onChange: (key: string, value: string) => void,
  onClear: (key: string) => void,
  onSortToggle: (key: string) => void,
): TableColumnsType<T> {
  return columns.map((column, index) => {
    if (hasChildColumns(column)) {
      return {
        ...column,
        children: mapSearchableColumns(
          column.children,
          activeSearchColumns,
          searchValues,
          sortStates,
          onToggle,
          onChange,
          onClear,
          onSortToggle,
        ),
      };
    }

    const appColumn = column as AppTableColumnType<T>;
    if (!isSearchableColumn(appColumn)) {
      return column;
    }

    const key = getColumnKey(column, index);
    const existingOnHeaderCell = column.onHeaderCell;
    const columnTitle =
      typeof column.title === "function" ? String(column.key ?? key) : column.title;
    const hasSorter = Boolean(column.sorter);

    return {
      ...column,
      // Ant Design attaches sort to every header click via onHeaderCell — remove
      // it here so double-click can open search without sorting first.
      sorter: undefined,
      sortOrder: undefined,
      title: (
        <ColumnSearchHeader
          title={columnTitle as ReactNode}
          value={searchValues[key] ?? ""}
          isActive={activeSearchColumns.has(key)}
          hasSorter={hasSorter}
          sortOrder={sortStates[key]}
          onToggle={() => onToggle(key)}
          onChange={(value) => onChange(key, value)}
          onClear={() => onClear(key)}
          onSortToggle={() => onSortToggle(key)}
        />
      ),
      onHeaderCell: ((col: ColumnType<T>) => {
        const existingProps = existingOnHeaderCell?.(col as never) ?? {};

        return {
          ...existingProps,
          className: [
            existingProps.className,
            "app-table-column-searchable-header",
          ]
            .filter(Boolean)
            .join(" "),
        };
      }) as ColumnType<T>["onHeaderCell"],
    };
  });
}

export function useColumnHeaderSearch<T>({
  columns,
  enabled = false,
}: UseColumnHeaderSearchOptions<T>) {
  const [activeSearchColumns, setActiveSearchColumns] = useState<Set<string>>(
    () => new Set(),
  );
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [sortStates, setSortStates] = useState<ColumnSortState>({});

  const handleToggle = useCallback((key: string) => {
    setActiveSearchColumns((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleChange = useCallback((key: string, value: string) => {
    setSearchValues((previous) => ({ ...previous, [key]: value }));
  }, []);

  const handleClear = useCallback((key: string) => {
    setActiveSearchColumns((previous) => {
      const next = new Set(previous);
      next.delete(key);
      return next;
    });
    setSearchValues((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }, []);

  const handleSortToggle = useCallback((key: string) => {
    setSortStates((previous) => {
      const next = { ...previous };
      const nextOrder = getNextColumnSortOrder(previous[key]);

      if (nextOrder) {
        next[key] = nextOrder;
      } else {
        delete next[key];
      }

      return next;
    });
  }, []);

  const searchableColumns = useMemo(() => {
    if (!enabled || !columns?.length) return columns;

    return mapSearchableColumns(
      columns,
      activeSearchColumns,
      searchValues,
      sortStates,
      handleToggle,
      handleChange,
      handleClear,
      handleSortToggle,
    );
  }, [
    activeSearchColumns,
    columns,
    enabled,
    handleToggle,
    handleChange,
    handleClear,
    handleSortToggle,
    searchValues,
    sortStates,
  ]);

  return {
    columns: searchableColumns,
    searchValues,
    sortStates,
  };
}
