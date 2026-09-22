import type { TableColumnsType, TableProps } from "antd";
import { AppSkeleton } from "../AppSkeleton/AppSkeleton";

const DEFAULT_SKELETON_ROW_COUNT = 10;
const ESTIMATED_ROW_HEIGHT = 55;

export function isTableLoading(loading: TableProps["loading"]): boolean {
  if (!loading) return false;
  if (typeof loading === "boolean") return loading;
  return loading.spinning !== false;
}

export function getSkeletonRowCount(
  scroll: TableProps["scroll"],
  pagination: TableProps["pagination"],
): number {
  if (pagination && typeof pagination === "object" && pagination.pageSize) {
    return pagination.pageSize;
  }

  const scrollY = scroll?.y;
  if (typeof scrollY === "number" && scrollY > 0) {
    return Math.max(1, Math.ceil(scrollY / ESTIMATED_ROW_HEIGHT));
  }

  return DEFAULT_SKELETON_ROW_COUNT;
}

export function createSkeletonDataSource<T>(count: number): T[] {
  return Array.from({ length: count }, (_, index) => ({
    key: `__app-table-skeleton-${index}__`,
  })) as T[];
}

function mapColumnsWithSkeleton<T>(
  columns: TableColumnsType<T>,
): TableColumnsType<T> {
  return columns.map((column) => {
    if ("children" in column && column.children?.length) {
      return {
        ...column,
        children: mapColumnsWithSkeleton(column.children),
      };
    }

    return {
      ...column,
      render: () => (
        <AppSkeleton.Input
          active
          size="small"
          block
          className="min-w-0"
          style={{ height: 20, minHeight: 10 }}
        />
      ),
    };
  });
}

export function resolveTableColumns<T>(
  columns: TableColumnsType<T> | undefined,
  loading: boolean,
): TableColumnsType<T> | undefined {
  if (!loading || !columns?.length) return columns;
  return mapColumnsWithSkeleton(columns);
}
