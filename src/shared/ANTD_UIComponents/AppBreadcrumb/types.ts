export interface AppBreadcrumbTab {
  path: string;
  title: string;
}

import type { ReactNode } from "react";

export interface AppBreadcrumbProps {
  tabs: AppBreadcrumbTab[];
  activePath: string;
  onTabClick?: (path: string) => void;
  onTabClose?: (path: string) => void;
  onClearAll?: () => void;
  homeTitle?: string;
  detailsLabel?: string;
  clearAllLabel?: string;
  maxVisibleTabs?: number;
  startSlot?: ReactNode;
  className?: string;
}
