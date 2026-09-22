import { type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import type { SortOrder } from "antd/es/table/interface";
import clsx from "clsx";
import { Search } from "lucide-react";
import AppInput from "../AppInput";

type ColumnSearchHeaderProps = {
  title: ReactNode;
  value: string;
  isActive: boolean;
  sortOrder?: SortOrder;
  hasSorter?: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  onClear: () => void;
  onSortToggle?: () => void;
};

const ColumnSearchHeader = ({
  title,
  value,
  isActive,
  sortOrder,
  hasSorter = false,
  onToggle,
  onChange,
  onClear,
  onSortToggle,
}: ColumnSearchHeaderProps) => {
  const stopSorterActivation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onToggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      onClear();
    }
  };

  const sortButton = hasSorter ? (
    <button
      type="button"
      className="app-table-column-search__sorter"
      aria-label="Sort column"
      onMouseDown={stopSorterActivation}
      onClick={(event) => {
        event.stopPropagation();
        onSortToggle?.();
      }}
    >
      <span className="app-table-column-search__sorter-inner">
        <CaretUpOutlined
          className={clsx(
            "app-table-column-search__sorter-up",
            sortOrder === "ascend" && "app-table-column-search__sorter-active",
          )}
        />
        <CaretDownOutlined
          className={clsx(
            "app-table-column-search__sorter-down",
            sortOrder === "descend" && "app-table-column-search__sorter-active",
          )}
        />
      </span>
    </button>
  ) : null;

  if (isActive) {
    return (
      <div className="app-table-column-search app-table-column-search--active">
        <div
          className="app-table-column-search__input-wrap"
          onMouseDown={stopSorterActivation}
          onClick={stopSorterActivation}
          onDoubleClick={handleDoubleClick}
        >
          <AppInput
            autoFocus
            size="small"
            value={value}
            placeholder="Search…"
            allowClear
            prefix={<Search size={14} className="text-(--Grey600)" />}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onMouseDown={stopSorterActivation}
            onClick={stopSorterActivation}
          />
        </div>
        {sortButton}
      </div>
    );
  }

  return (
    <div className="app-table-column-search">
      <div
        className="app-table-column-search__title-wrap"
        title="Double-click to search"
        onMouseDown={stopSorterActivation}
        onClick={stopSorterActivation}
        onDoubleClick={handleDoubleClick}
      >
        <span className="app-table-column-search__title">{title}</span>
        {value.trim() ? (
          <Search
            size={14}
            className="shrink-0 text-(--Primary400)"
            aria-label="Column filtered"
          />
        ) : null}
      </div>
      {sortButton}
    </div>
  );
};

export default ColumnSearchHeader;
