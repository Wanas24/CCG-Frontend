import type React from "react";
import type { MenuProps } from "antd";

export type AntMenuItem = Required<MenuProps>["items"][number];

export interface MenuItemConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permissions?: string[];
  children?: MenuItemConfig[];
}

export interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
  defaultCollapsed?: boolean;
  permissions?: string[];
  menuConfig?: MenuItemConfig[];
  expandedWidth?: string;
  collapsedWidth?: string;
  autoCollapseBelow?: number | false;
}

export interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapse: () => void;
  menuConfig: MenuItemConfig[];
  permissions: string[];
}
