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
  const { collapsed, menuConfig, permissions } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  // Recompute only when config or permissions change — not on every render.
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
      if (path) navigate(path);
    },
    [menuPaths, navigate],
  );

  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll`}>
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
