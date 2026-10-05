import type { ReactNode } from "react";
import type { TableProps } from "antd";
import type { ColumnType } from "antd/es/table";

export interface IDataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

export type AppTableColumnType<T> = ColumnType<T> & {
  /** Set to false to disable resizing for a single column. Enabled by default. */
  resizable?: boolean;
  /** Set to false to disable double-click header search for a single column. */
  searchable?: boolean;
};

export type AppTableServerPagination = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
};

export type AppTableProps<T = IDataType> = TableProps<T> & {
  filterContent?: ReactNode;
  filterPanelWidth?: string;
  footerContent?: ReactNode;
  /**
   * Controlled server pagination. `dataSource` is the current page only.
   * Changing the page size requests page 1.
   */
  serverPagination?: AppTableServerPagination;
  /** Enable drag-to-resize column headers. Defaults to true. */
  resizableColumns?: boolean;
  /**
   * Double-click a column header to show an inline search field and filter rows
   * client-side. Set `searchable: false` on a column to opt out.
   */
  columnHeaderSearch?: boolean;
};
