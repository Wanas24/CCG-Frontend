import {
  useCallback,
  useRef,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type SyntheticEvent,
} from "react";
import type { ResizeCallbackData } from "./resizeTypes";
import clsx from "clsx";

export type ResizableHeaderCellProps = HTMLAttributes<HTMLTableCellElement> & {
  width?: number;
  isRtl?: boolean;
  onResize?: (event: SyntheticEvent, data: ResizeCallbackData) => void;
  onResizeStart?: (event: SyntheticEvent, data: ResizeCallbackData) => void;
  onResizeStop?: (event: SyntheticEvent, data: ResizeCallbackData) => void;
};

const MIN_COLUMN_WIDTH = 60;

function buildResizeData(width: number, isRtl: boolean): ResizeCallbackData {
  return {
    size: { width, height: 0 },
    node: document.createElement("th"),
    handle: isRtl ? "w" : "e",
  };
}

const ResizableHeaderCell = ({
  onResize,
  onResizeStart,
  onResizeStop,
  width,
  isRtl = false,
  children,
  className,
  style,
  ...restProps
}: ResizableHeaderCellProps) => {
  const resizingRef = useRef(false);
  const resolvedWidth = typeof width === "number" ? width : Number(width);

  const handleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();

      if (!onResize || !Number.isFinite(resolvedWidth)) return;

      resizingRef.current = true;
      const startX = event.clientX;
      const startWidth = resolvedWidth;

      if (import.meta.env.DEV) {
        console.log("[AppTable resize] start", {
          startWidth,
          isRtl,
        });
      }

      onResizeStart?.(event, buildResizeData(startWidth, isRtl));

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        if (!resizingRef.current) return;

        const deltaX = isRtl
          ? startX - moveEvent.clientX
          : moveEvent.clientX - startX;
        const nextWidth = Math.max(
          MIN_COLUMN_WIDTH,
          Math.round(startWidth + deltaX),
        );

        onResize(
          moveEvent as unknown as SyntheticEvent,
          buildResizeData(nextWidth, isRtl),
        );
      };

      const handleMouseUp = (upEvent: globalThis.MouseEvent) => {
        if (!resizingRef.current) return;

        resizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        const deltaX = isRtl
          ? startX - upEvent.clientX
          : upEvent.clientX - startX;
        const nextWidth = Math.max(
          MIN_COLUMN_WIDTH,
          Math.round(startWidth + deltaX),
        );

        if (import.meta.env.DEV) {
          console.log("[AppTable resize] stop", { nextWidth });
        }

        onResizeStop?.(
          upEvent as unknown as SyntheticEvent,
          buildResizeData(nextWidth, isRtl),
        );
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isRtl, onResize, onResizeStart, onResizeStop, resolvedWidth],
  );

  if (!Number.isFinite(resolvedWidth) || resolvedWidth <= 0 || !onResize) {
    if (import.meta.env.DEV && resolvedWidth > 0) {
      console.warn("[AppTable resize] missing onResize for header cell", {
        width: resolvedWidth,
      });
    }
    return (
      <th className={className} style={style} {...restProps}>
        {children}
      </th>
    );
  }

  const handleAxis = isRtl ? "w" : "e";

  return (
    <th
      {...restProps}
      className={clsx(className, "react-resizable")}
      style={style}
    >
      {children}
      <span
        className={clsx(
          "app-table-resize-handle",
          "react-resizable-handle",
          `react-resizable-handle-${handleAxis}`,
        )}
        aria-hidden
        onMouseDown={handleResizeStart}
        onClick={(event) => event.stopPropagation()}
      />
    </th>
  );
};

export default ResizableHeaderCell;
