import AppBreadcrumb from "../../AppBreadcrumb/AppBreadcrumb";
import AppBreadcrumbActions from "../../AppBreadcrumb/AppBreadcrumbActions";
import type { AppBreadcrumbTab } from "../../AppBreadcrumb/types";
import { useBreadcrumbTabs } from "../../AppBreadcrumb/useBreadcrumbTabs";
import { useLocation, useNavigate } from "react-router";

const DEMO_TABS: AppBreadcrumbTab[] = [
  { path: "/buttons", title: "Buttons" },
  { path: "/inputs", title: "Inputs" },
  { path: "/dropdowns", title: "Dropdowns" },
];

const AppBreadCrumpTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, handleTabClose, handleClearAll } = useBreadcrumbTabs(
    DEMO_TABS,
    location.pathname,
  );

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleTabCloseWithNavigate = (path: string) => {
    const index = tabs.findIndex((tab) => tab.path === path);
    const isActive = location.pathname === path;
    const fallbackPath = index > 0 ? tabs[index - 1].path : "/";

    handleTabClose(path);

    if (isActive) {
      navigate(fallbackPath);
    }
  };

  const handleClearAllWithNavigate = () => {
    handleClearAll();
    navigate("/");
  };

  return (
    <AppBreadcrumb
      className="mt-2"
      tabs={tabs}
      activePath={location.pathname}
      onTabClick={handleTabClick}
      onTabClose={handleTabCloseWithNavigate}
      onClearAll={handleClearAllWithNavigate}
      startSlot={<AppBreadcrumbActions />}
    />
  );
};

export default AppBreadCrumpTabs;
