import type React from "react";
import type { MenuProps } from "antd";

/** Ant Design menu item type alias. */
export type AntMenuItem = Required<MenuProps>["items"][number];

/**
 * A single node in the ERP navigation tree.
 *
 * Supports unlimited nesting via `children`, optional role-based gating via
 * `permissions`, and optional React Router path via `path`.
 */
export interface MenuItemConfig {
  /** Unique key used by Ant Design Menu and as the routing lookup key. */
  key: string;
  label: string;
  icon?: React.ReactNode;
  /**
   * React Router path to navigate to on click.
   * Omit for non-navigable group headers.
   */
  path?: string;
  /**
   * Required role/permission strings. The item is visible only when the
   * active user holds at least one of these strings.
   * An empty array (default) means visible to everyone.
   */
  permissions?: string[];
  children?: MenuItemConfig[];
}

/** Props for the public AppSidebar component. */
export interface AppSidebarProps {
  /** Controlled collapsed state — when provided the parent owns the state. */
  collapsed?: boolean;
  /** Called when the user clicks the toggle button (controlled mode). */
  onCollapse?: () => void;
  /** Initial collapsed state for uncontrolled usage. Defaults to `false`. */
  defaultCollapsed?: boolean;
  /**
   * Active user permissions used to filter menu items.
   * Pass `[]` (default) to show everything.
   */
  permissions?: string[];
  /**
   * Override the default menu item configuration.
   * Accepts an arbitrarily deep tree — all levels are processed recursively.
   */
  menuConfig?: MenuItemConfig[];
  /**
   * Width of the sidebar when expanded. Accepts any valid CSS width value.
   * Defaults to `"16%"`.
   */
  expandedWidth?: string;
  /**
   * Width of the sidebar when collapsed. Accepts any valid CSS width value.
   * Defaults to `"5%"`.
   */
  collapsedWidth?: string;
  /**
   * Viewport width (px) below which the sidebar auto-collapses on load and
   * when resizing. Set to `false` to disable. Defaults to `1024` (tablet).
   */
  autoCollapseBelow?: number | false;
}

/**
 * Value exposed by SidebarContext.
 * Consumed by all sidebar sub-components to avoid prop drilling.
 */
export interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapse: () => void;
  isRtl: boolean;
  menuConfig: MenuItemConfig[];
  permissions: string[];
}
