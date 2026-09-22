import { memo, useCallback, useContext, useState } from "react";
import { ConfigProvider, Divider } from "antd";
import { SidebarProvider } from "./SidebarContext";
import SidebarMenu from "./SidebarMenu";
import SidebarCollapseButton from "./SidebarCollapseButton";
import { defaultMenuConfig } from "./menuConfig";
import type { AppSidebarProps } from "./types";
import {
  SIDEBAR_TABLET_BREAKPOINT,
  useSidebarTabletBreakpoint,
} from "./utils";
import "./styles.css";

/** Logo shown at the top of the expanded sidebar. Hidden when collapsed. */
const SidebarLogo = memo(function SidebarLogo() {
  return (
    <div className="h-[50px] w-[50px] m-auto mt-3">
      <img
        className="h-full w-full object-cover"
        src="/assets/sidebar/sideLogo.webp"
        alt="logo"
      />
    </div>
  );
});

/** Horizontal rule beneath the logo. Hidden when collapsed. */
const SidebarDivider = memo(function SidebarDivider() {
  return (
    <div className="w-[85%] m-auto">
      <Divider orientation="horizontal" className="bg-gray-300/30!" />
    </div>
  );
});

const AppSidebar = ({
  collapsed: collapsedProp,
  onCollapse,
  defaultCollapsed = false,
  permissions = [],
  menuConfig = defaultMenuConfig,
  expandedWidth = "100%",
  collapsedWidth = "100%",
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

  const { direction } = useContext(ConfigProvider.ConfigContext);
  const isRtl = direction === "rtl";

  return (
    <SidebarProvider
      collapsed={effectiveCollapsed}
      onToggle={toggleCollapse}
      isRtl={isRtl}
      menuConfig={menuConfig}
      permissions={permissions}
    >
      <div
        style={{ width: effectiveCollapsed ? collapsedWidth : expandedWidth }}
        className="app-sidebar relative flex h-full shrink-0 overflow-hidden bg-(--Primary400)! transition-[width] duration-300 ease-in-out"
      >
        <div className="w-full flex flex-col justify-center h-full">
          <SidebarLogo />
          <SidebarDivider />
          <SidebarMenu />
          <div className="h-5" />
        </div>
        <SidebarCollapseButton />
      </div>
    </SidebarProvider>
  );
};

export default AppSidebar;
