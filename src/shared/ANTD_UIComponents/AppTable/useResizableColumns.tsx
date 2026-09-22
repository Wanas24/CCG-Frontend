import {
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type SyntheticEvent,
} from "react";
import { ConfigProvider } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import type { ColumnType } from "antd/es/table";
import type { ResizeCallbackData } from "./resizeTypes";
import ResizableHeaderCell from "./ResizableHeaderCell";
import { getColumnKey, hasChildColumns } from "./columnUtils";
import type { AppTableColumnType } from "./Types/tableTypes";

const DEFAULT_COLUMN_WIDTH = 120;

type ColumnWidthMap = Record<string, number>;

function resolveColumnWidth<T>(
  column: ColumnType<T>,
  columnWidths: ColumnWidthMap,
  key: string,
): number {
  const storedWidth = columnWidths[key];
  if (storedWidth != null) return storedWidth;

  if (typeof column.width === "number") return column.width;

  return DEFAULT_COLUMN_WIDTH;
}

function isResizableColumn<T>(column: AppTableColumnType<T>): boolean {
  return column.resizable !== false && !hasChildColumns(column);
}

function mapResizableColumns<T>(
  columns: TableColumnsType<T>,
  columnWidths: ColumnWidthMap,
  onColumnResize: (key: string) => (
    _event: SyntheticEvent,
    data: ResizeCallbackData,
  ) => void,
): TableColumnsType<T> {
  return columns.map((column, index) => {
    if (hasChildColumns(column)) {
      return {
        ...column,
        children: mapResizableColumns(column.children, columnWidths, onColumnResize),
      };
    }

    const appColumn = column as AppTableColumnType<T>;
    if (!isResizableColumn(appColumn)) {
      return column;
    }

    const key = getColumnKey(column, index);
    const width = resolveColumnWidth(column, columnWidths, key);
    const existingOnHeaderCell = column.onHeaderCell;

    return {
      ...column,
      width,
      onHeaderCell: ((col: ColumnType<T>) => {
        const existingProps = existingOnHeaderCell?.(col as never) ?? {};
        const colWidth =
          typeof col.width === "number" ? col.width : width;

        return {
          ...existingProps,
          width: colWidth,
          onResize: onColumnResize(key),
          onResizeStop: onColumnResize(key),
        };
      }) as ColumnType<T>["onHeaderCell"],
    };
  });
}


type UseResizableColumnsOptions<T> = {
  columns: TableColumnsType<T> | undefined;
  enabled?: boolean;
  components?: TableProps<T>["components"];
};

export function useResizableColumns<T>({
  columns,
  enabled = true,
  components,
}: UseResizableColumnsOptions<T>) {
  const { direction } = useContext(ConfigProvider.ConfigContext);
  const isRtl = direction === "rtl";
  const [columnWidths, setColumnWidths] = useState<ColumnWidthMap>({});

  const handleColumnResize = useCallback(
    (key: string) => (_event: SyntheticEvent, data: ResizeCallbackData) => {
      const nextWidth = Math.round(data.size.width);
      setColumnWidths((previous) => {
        if (previous[key] === nextWidth) return previous;
        return { ...previous, [key]: nextWidth };
      });
    },
    [],
  );

  const resizableColumns = useMemo(() => {
    if (!enabled || !columns?.length) return columns;

    return mapResizableColumns(columns, columnWidths, handleColumnResize);
  }, [columns, columnWidths, enabled, handleColumnResize]);

  const resizableComponents = useMemo<TableProps<T>["components"]>(() => {
    if (!enabled) return components;

    const HeaderCell = (props: ComponentProps<typeof ResizableHeaderCell>) => (
      <ResizableHeaderCell {...props} isRtl={isRtl} />
    );

    return {
      ...components,
      header: {
        ...components?.header,
        cell: HeaderCell,
      },
    };
  }, [components, enabled, isRtl]);

  return {
    columns: resizableColumns,
    components: resizableComponents,
    isRtl,
  };
}
