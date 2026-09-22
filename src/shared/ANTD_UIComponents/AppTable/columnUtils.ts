import type { TableColumnsType } from "antd";
import type { ColumnGroupType, ColumnType } from "antd/es/table";

export function getColumnKey<T>(column: ColumnType<T>, index: number): string {
  if (column.key != null) return String(column.key);

  const { dataIndex } = column;
  if (Array.isArray(dataIndex)) return dataIndex.join(".");
  if (dataIndex != null) return String(dataIndex);

  return `__col_${index}`;
}

export function hasChildColumns<T>(
  column: ColumnType<T> | ColumnGroupType<T>,
): column is ColumnGroupType<T> {
  return (
    Array.isArray((column as ColumnGroupType<T>).children)
    && (column as ColumnGroupType<T>).children.length > 0
  );
}

export function findColumnByKey<T>(
  columns: TableColumnsType<T>,
  key: string,
): ColumnType<T> | undefined {
  for (const [index, column] of columns.entries()) {
    if (hasChildColumns(column)) {
      const nested = findColumnByKey(column.children, key);
      if (nested) return nested;
      continue;
    }

    if (getColumnKey(column, index) === key) return column;
  }

  return undefined;
}

export function getRecordFieldValue<T>(
  record: T,
  dataIndex: ColumnType<T>["dataIndex"],
): unknown {
  if (dataIndex == null) return undefined;

  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>((value, key) => {
      if (value == null || typeof value !== "object") return undefined;
      return (value as Record<string | number | symbol, unknown>)[key as string];
    }, record);
  }

  return (record as Record<string | number | symbol, unknown>)[
    dataIndex as string
  ];
}
