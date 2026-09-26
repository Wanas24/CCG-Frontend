import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import {
  AppSidebar,
  useSidebarTabletBreakpoint,
} from "@/shared/ANTD_UIComponents";
import { AppNavbar } from "@/shared/components";
import { NavigationProgressFallback } from "@/shared/components/NavigationProgress/NavigationProgress";

const SIDEBAR_EXPANDED_WIDTH = "16rem";
const SIDEBAR_COLLAPSED_WIDTH = "4.5rem";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isBelowTablet = useSidebarTabletBreakpoint();
  const effectiveCollapsed = collapsed || isBelowTablet;

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-(--app-bg) text-(--app-text)">
      <AppSidebar
        collapsed={effectiveCollapsed}
        onCollapse={toggleCollapse}
        expandedWidth={SIDEBAR_EXPANDED_WIDTH}
        collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
        autoCollapseBelow={false}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppNavbar
          collapsed={effectiveCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={<NavigationProgressFallback />}>
            <div className="mx-auto w-full px-4 py-2">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
