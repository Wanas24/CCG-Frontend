import { memo, useMemo, useCallback, useEffect, useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router";
import { useSidebar } from "./SidebarContext";
import {
  buildMenuItems,
  buildMenuPaths,
  getAncestorKeys,
  getSelectedKey,
} from "./utils";

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

  const routeOpenKeys = useMemo(
    () => getAncestorKeys(location.pathname, menuConfig),
    [location.pathname, menuConfig],
  );

  const [openKeys, setOpenKeys] = useState(routeOpenKeys);

  useEffect(() => {
    if (routeOpenKeys.length === 0) return;

    setOpenKeys((current) => {
      const missing = routeOpenKeys.filter((key) => !current.includes(key));
      return missing.length === 0 ? current : [...current, ...missing];
    });
  }, [routeOpenKeys]);

  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys);
  }, []);

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
        openKeys={collapsed ? undefined : openKeys}
        onOpenChange={collapsed ? undefined : handleOpenChange}
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
