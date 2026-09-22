import type { SyntheticEvent } from "react";

/**
 * Local shape compatible with react-resizable's ResizeCallbackData.
 * Defined here so AppTable does not require the react-resizable package.
 */
export type ResizeCallbackData = {
  size: { width: number; height: number };
  node: HTMLElement;
  handle: string;
};

export type ResizeHandler = (
  event: SyntheticEvent,
  data: ResizeCallbackData,
) => void;
