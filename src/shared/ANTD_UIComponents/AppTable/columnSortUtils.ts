import type { TableColumnsType } from "antd";
import type { ColumnType, SortOrder } from "antd/es/table/interface";
import { findColumnByKey } from "./columnUtils";

export type ColumnSortState = Record<string, SortOrder>;

function getColumnSorterFn<T>(sorter: ColumnType<T>["sorter"]) {
  if (typeof sorter === "function") return sorter;

  if (
    sorter
    && typeof sorter === "object"
    && typeof sorter.compare === "function"
  ) {
    return sorter.compare;
  }

  return undefined;
}

export function getNextColumnSortOrder(
  current?: SortOrder,
): SortOrder | undefined {
  if (!current) return "ascend";
  if (current === "ascend") return "descend";
  return undefined;
}

export function applyColumnSort<T>(
  dataSource: readonly T[],
  columns: TableColumnsType<T> | undefined,
  sortStates: ColumnSortState,
): T[] {
  const activeSorts = Object.entries(sortStates).filter(
    ([, order]) => order === "ascend" || order === "descend",
  );

  if (!columns?.length || !activeSorts.length) return [...dataSource];

  const sorted = [...dataSource];
  sorted.sort((recordA, recordB) => {
    for (const [columnKey, sortOrder] of activeSorts) {
      const column = findColumnByKey(columns, columnKey);
      const compareFn = getColumnSorterFn(column?.sorter);
      if (!compareFn || !sortOrder) continue;

      const compareResult = compareFn(recordA, recordB, sortOrder);
      if (compareResult !== 0) {
        return sortOrder === "ascend" ? compareResult : -compareResult;
      }
    }

    return 0;
  });

  return sorted;
}
