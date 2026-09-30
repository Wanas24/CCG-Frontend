import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { SidebarProvider } from "./SidebarContext";
import SidebarMenu from "./SidebarMenu";
import SidebarCollapseButton from "./SidebarCollapseButton";
import SidebarHeader from "./SidebarHeader";
import { defaultMenuConfig } from "./menuConfig";
import type { AppSidebarProps } from "./types";
import {
  SIDEBAR_TABLET_BREAKPOINT,
  useSidebarTabletBreakpoint,
} from "./utils";
import "./styles.css";

const AppSidebar = ({
  collapsed: collapsedProp,
  onCollapse,
  defaultCollapsed = false,
  permissions = [],
  menuConfig = defaultMenuConfig,
  expandedWidth = "15rem",
  collapsedWidth = "4.5rem",
  autoCollapseBelow = SIDEBAR_TABLET_BREAKPOINT,
  hideCollapseControl = false,
  onNavigate,
}: AppSidebarProps) => {
  const isBelowTablet = useSidebarTabletBreakpoint(autoCollapseBelow);
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (defaultCollapsed) return true;
    if (autoCollapseBelow === false) return false;
    return window.innerWidth < autoCollapseBelow;
  });
  const previousBelowTabletRef = useRef(isBelowTablet);

  useEffect(() => {
    if (collapsedProp !== undefined) return;
    if (autoCollapseBelow === false) return;

    if (previousBelowTabletRef.current !== isBelowTablet) {
      setInternalCollapsed(isBelowTablet);
      previousBelowTabletRef.current = isBelowTablet;
    }
  }, [autoCollapseBelow, collapsedProp, isBelowTablet]);

  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp : internalCollapsed;

  const toggleCollapse = useCallback(() => {
    if (onCollapse) {
      onCollapse();
    } else if (!isControlled) {
      setInternalCollapsed((prev) => !prev);
    }
  }, [isControlled, onCollapse]);

  const { direction } = useContext(ConfigProvider.ConfigContext);
  const isRtl = direction === "rtl";

  return (
    <SidebarProvider
  collapsed={collapsed}
  onToggle={toggleCollapse}
  isRtl={isRtl}
  menuConfig={menuConfig}
  permissions={permissions}
  onNavigate={onNavigate}
>
  <div className="relative h-full shrink-0">
    <div
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
      className="app-sidebar flex h-full overflow-hidden bg-(--Primary400)! transition-[width] duration-300 ease-in-out"
    >
      <div className="flex h-full w-full flex-col gap-2">
        <SidebarHeader />
        <SidebarMenu />
        <div className="h-5 shrink-0" />
      </div>
    </div>

    {!hideCollapseControl && <SidebarCollapseButton />}
  </div>
</SidebarProvider>
  );
};

export default memo(AppSidebar);
