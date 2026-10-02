import { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import { SidebarProvider } from "./SidebarContext";
import SidebarMenu from "./SidebarMenu";
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
  expandOnHover = false,
  onNavigate,
}: AppSidebarProps) => {
  const isBelowTablet = useSidebarTabletBreakpoint(
    expandOnHover ? false : autoCollapseBelow,
  );
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (expandOnHover || defaultCollapsed) return true;
    if (autoCollapseBelow === false) return false;
    return window.innerWidth < autoCollapseBelow;
  });
  const [hovered, setHovered] = useState(false);
  const previousBelowTabletRef = useRef(isBelowTablet);

  useEffect(() => {
    if (expandOnHover) return;
    if (collapsedProp !== undefined) return;
    if (autoCollapseBelow === false) return;

    if (previousBelowTabletRef.current !== isBelowTablet) {
      setInternalCollapsed(isBelowTablet);
      previousBelowTabletRef.current = isBelowTablet;
    }
  }, [autoCollapseBelow, collapsedProp, expandOnHover, isBelowTablet]);

  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled
    ? collapsedProp
    : expandOnHover
      ? !hovered
      : internalCollapsed;

  const toggleCollapse = useCallback(() => {
    if (expandOnHover) {
      return;
    }

    if (onCollapse) {
      onCollapse();
    } else if (!isControlled) {
      setInternalCollapsed((prev) => !prev);
    }
  }, [expandOnHover, isControlled, onCollapse]);

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
      <div
        className="relative h-full shrink-0"
        onMouseEnter={
          expandOnHover
            ? () => {
                setHovered(true);
              }
            : undefined
        }
        onMouseLeave={
          expandOnHover
            ? () => {
                setHovered(false);
              }
            : undefined
        }
      >
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
      </div>
    </SidebarProvider>
  );
};

export default memo(AppSidebar);
