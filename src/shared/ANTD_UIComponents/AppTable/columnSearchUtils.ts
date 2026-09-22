import type { TableColumnsType } from "antd";
import {
  findColumnByKey,
  getRecordFieldValue,
  hasChildColumns,
} from "./columnUtils";
import type { AppTableColumnType } from "./Types/tableTypes";

export function isSearchableColumn<T>(column: AppTableColumnType<T>): boolean {
  if (column.searchable === false) return false;
  if (hasChildColumns(column)) return false;

  const { dataIndex } = column;
  return dataIndex != null && dataIndex !== "";
}

export function filterDataByColumnSearch<T>(
  dataSource: readonly T[],
  columns: TableColumnsType<T> | undefined,
  searchValues: Record<string, string>,
): T[] {
  if (!columns?.length) return [...dataSource];

  const activeSearches = Object.entries(searchValues).filter(
    ([, value]) => value.trim().length > 0,
  );

  if (!activeSearches.length) return [...dataSource];

  return dataSource.filter((record) =>
    activeSearches.every(([columnKey, searchText]) => {
      const column = findColumnByKey(columns, columnKey);
      if (!column?.dataIndex) return true;

      const fieldValue = getRecordFieldValue(record, column.dataIndex);
      return String(fieldValue ?? "")
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());
    }),
  );
}
