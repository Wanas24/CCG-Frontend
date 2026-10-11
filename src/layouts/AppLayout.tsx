import { Suspense, useState } from "react";
import { Outlet } from "react-router";
import AiAssistant from "@/modules/ai/components/AiAssistant";
import MyApprovalRequestsLauncher from "@/modules/approval/components/MyApprovalRequestsLauncher";
import { useLocale } from "@/i18n/useLocale";
import { AppNavbar } from "@/shared/components";
import { AppDrawer, AppSidebar } from "@/shared/ANTD_UIComponents";
import { NavigationProgressFallback } from "@/shared/components/NavigationProgress/NavigationProgress";
import {
  SIDEBAR_TABLET_BREAKPOINT,
  useIsMobileSidebar,
} from "@/shared/ANTD_UIComponents/AppSidebar/utils";
import { useAppSidebarNavigation } from "./navigation/useAppSidebarNavigation";

const AppLayout = () => {
  const { menuConfig, grantedPermissions } = useAppSidebarNavigation();
  const { isRtl } = useLocale();
  const isMobile = useIsMobileSidebar(SIDEBAR_TABLET_BREAKPOINT);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileSidebar = () => setMobileOpen(false);

  const sidebarProps = {
    menuConfig,
    permissions: grantedPermissions,
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-transparent text-(--app-text)">
      {!isMobile && (
        <AppSidebar
          {...sidebarProps}
          expandOnHover
          defaultCollapsed
          expandedWidth="15rem"
          collapsedWidth="4.5rem"
        />
      )}

      {isMobile && (
        <AppDrawer
          open={mobileOpen}
          onClose={closeMobileSidebar}
          placement={isRtl ? "right" : "left"}
          width="15rem"
          destroyOnHidden
          styles={{
            body: { padding: 0, height: "100%" },
            header: { display: "none" },
          }}
          classNames={{
            body: "sidebar-bg",
          }}
        >
          <AppSidebar
            {...sidebarProps}
            collapsed={false}
            expandedWidth="100%"
            collapsedWidth="100%"
            autoCollapseBelow={false}
            hideCollapseControl
            onNavigate={closeMobileSidebar}
          />
        </AppDrawer>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppNavbar
          showSidebarTrigger={isMobile}
          onOpenSidebar={() => setMobileOpen(true)}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Suspense fallback={<NavigationProgressFallback />}>
            <section className="p-4 sm:p-6">
              <Outlet />
            </section>
          </Suspense>
        </main>
        <AiAssistant />
        <MyApprovalRequestsLauncher />
      </div>
    </div>
  );
};

export default AppLayout;
