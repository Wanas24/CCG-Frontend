import { useEffect, useState } from "react";
import type { MenuItemConfig, AntMenuItem } from "./types";

/** Default max viewport width treated as tablet for sidebar auto-collapse. */
export const SIDEBAR_TABLET_BREAKPOINT = 1024;

/** Mobile layout uses a drawer instead of an inline sidebar. */
export const SIDEBAR_MOBILE_BREAKPOINT = 768;

function isBelowSidebarBreakpoint(width: number, breakpoint: number) {
  return width < breakpoint;
}

/**
 * Tracks whether the viewport is below the sidebar tablet breakpoint.
 * Returns `false` when `autoCollapseBelow` is disabled.
 */
export function useSidebarTabletBreakpoint(
  autoCollapseBelow: number | false = SIDEBAR_TABLET_BREAKPOINT,
) {
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (!autoCollapseBelow) return false;

  return isBelowSidebarBreakpoint(viewportWidth, autoCollapseBelow);
}

export function useIsMobileSidebar(
  mobileBreakpoint: number = SIDEBAR_MOBILE_BREAKPOINT,
) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < mobileBreakpoint,
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mobileBreakpoint]);

  return isMobile;
}

function hasAccess(item: MenuItemConfig, userPermissions: string[]): boolean {
  if (!item.permissions || item.permissions.length === 0) return true;
  return item.permissions.some((p) => userPermissions.includes(p));
}

export function buildMenuItems(
  items: MenuItemConfig[],
  userPermissions: string[] = [],
): AntMenuItem[] {
  return items
    .filter((item) => hasAccess(item, userPermissions))
    .map((item) => {
      const children = item.children
        ? buildMenuItems(item.children, userPermissions)
        : undefined;

      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children,
      } as AntMenuItem;
    });
}

export function buildMenuPaths(
  items: MenuItemConfig[],
  result: Record<string, string> = {},
): Record<string, string> {
  for (const item of items) {
    if (item.path) result[item.key] = item.path;
    if (item.children) buildMenuPaths(item.children, result);
  }
  return result;
}

export function getSelectedKey(
  pathname: string,
  menuPaths: Record<string, string>,
  fallback = "",
): string[] {
  const key = Object.keys(menuPaths).find((k) => {
    const p = menuPaths[k];
    if (!p) return false;
    return (
      pathname === p ||
      (pathname.startsWith(p) &&
        (pathname.length === p.length || pathname[p.length] === "/"))
    );
  });
  if (key) return [key];
  return fallback ? [fallback] : [];
}
