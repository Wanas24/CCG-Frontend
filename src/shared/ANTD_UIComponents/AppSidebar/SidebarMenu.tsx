import { memo, useMemo, useCallback } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router";
import { useSidebar } from "./SidebarContext";
import { buildMenuItems, buildMenuPaths, getSelectedKey } from "./utils";

/**
 * Memoized Ant Design Menu wired to React Router.
 *
 * Re-renders only when `collapsed`, `menuConfig`, `permissions`, or the
 * current pathname changes — not on every parent render.
 */
const SidebarMenu = memo(function SidebarMenu() {
  const { collapsed, menuConfig, permissions, onNavigate } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(
    () => buildMenuItems(menuConfig, permissions),
    [menuConfig, permissions],
  );

  const menuPaths = useMemo(() => buildMenuPaths(menuConfig), [menuConfig]);

  const selectedKeys = useMemo(() => {
    const fallback = Object.keys(menuPaths)[0] ?? "";
    return getSelectedKey(location.pathname, menuPaths, fallback);
  }, [location.pathname, menuPaths]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const path = menuPaths[key];
      if (path) {
        navigate(path);
        onNavigate?.();
      }
    },
    [menuPaths, navigate, onNavigate],
  );

  return (
    <div className="sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
      <Menu
        overflowedIndicator={null}
        selectedKeys={selectedKeys}
        mode="inline"
        inlineCollapsed={collapsed}
        items={menuItems}
        className="border-r-0!"
        onClick={handleMenuClick}
      />
    </div>
  );
});

export default SidebarMenu;
