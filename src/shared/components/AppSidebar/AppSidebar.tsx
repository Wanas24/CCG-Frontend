import { memo, useCallback, useState } from "react";
import { Divider } from "antd";
import { SidebarProvider } from "./SidebarContext";
import SidebarMenu from "./SidebarMenu";
import { defaultMenuConfig } from "./menuConfig";
import type { AppSidebarProps } from "./types";
import { SIDEBAR_TABLET_BREAKPOINT, useSidebarTabletBreakpoint } from "./utils";
import "./styles.css";

const SidebarLogo = memo(function SidebarLogo() {
  return (
    <div className="m-auto mt-3 flex items-center gap-2">
      <img
        src="/assets/logo-dark-tight.webp"
        alt="logo"
        className="h-16 w-20 object-contain"
      />
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1.5 text-sm font-bold uppercase tracking-wide">
          <span className="text-(--sidebar-text)">Construct</span>
          <span className="text-(--Secondary300)">Code</span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-(--Primary300)">
          Group
        </span>
      </div>
    </div>
  );
});

const SidebarDivider = memo(function SidebarDivider() {
  return (
    <div className="m-auto w-[85%]">
      <Divider
        orientation="horizontal"
        className="my-2! border-(--sidebar-text)/20!"
      />
    </div>
  );
});

const AppSidebar = ({
  collapsed: collapsedProp,
  onCollapse,
  defaultCollapsed = false,
  permissions = [],
  menuConfig = defaultMenuConfig,
  expandedWidth = "16rem",
  collapsedWidth = "4.5rem",
  autoCollapseBelow = SIDEBAR_TABLET_BREAKPOINT,
}: AppSidebarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isBelowTablet = useSidebarTabletBreakpoint(autoCollapseBelow);

  const isControlled = collapsedProp !== undefined;
  const collapsed = isControlled ? collapsedProp : internalCollapsed;
  const effectiveCollapsed = collapsed || isBelowTablet;

  const toggleCollapse = useCallback(() => {
    if (onCollapse) {
      onCollapse();
    } else if (!isControlled) {
      setInternalCollapsed((prev) => !prev);
    }
  }, [isControlled, onCollapse]);

  return (
    <SidebarProvider
      collapsed={effectiveCollapsed}
      onToggle={toggleCollapse}
      menuConfig={menuConfig}
      permissions={permissions}
    >
      <div
        style={{ width: effectiveCollapsed ? collapsedWidth : expandedWidth }}
        className="app-sidebar relative flex h-dvh shrink-0 overflow-hidden bg-(--sidebar-bg)! text-(--sidebar-text) transition-[width] duration-300 ease-in-out"
      >
        <div className="flex h-full w-full flex-col justify-center">
          <SidebarLogo />
          <SidebarDivider />
          <SidebarMenu />
          <div className="h-5" />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
