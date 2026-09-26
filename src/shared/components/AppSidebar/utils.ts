import { useEffect, useState } from "react";
import type { MenuItemConfig, AntMenuItem } from "./types";

/** Default max viewport width treated as tablet for sidebar auto-collapse. */
export const SIDEBAR_TABLET_BREAKPOINT = 1024;

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

// ---------------------------------------------------------------------------
// Permission helpers
// ---------------------------------------------------------------------------

function hasAccess(item: MenuItemConfig, userPermissions: string[]): boolean {
  if (!item.permissions || item.permissions.length === 0) return true;
  return item.permissions.some((p) => userPermissions.includes(p));
}

// ---------------------------------------------------------------------------
// Menu item builders (recursive — supports unlimited nesting)
// ---------------------------------------------------------------------------

/**
 * Convert a MenuItemConfig tree into the format Ant Design Menu expects,
 * filtering out items the current user cannot access.
 *
 * This is a pure function — memoize with useMemo at the call site.
 */
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

/**
 * Recursively extract every key → path mapping from the config tree.
 * Items without a `path` are skipped (they are non-navigable groups).
 *
 * This is a pure function — memoize with useMemo at the call site.
 */
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

// ---------------------------------------------------------------------------
// Active-route resolver
// ---------------------------------------------------------------------------

/**
 * Find the best-matching menu key for a given URL pathname.
 *
 * Matching rules (in order):
 *  1. Exact match: `pathname === path`
 *  2. Prefix match: `pathname` starts with `path` and the next character is `/`
 *     (prevents `/foo` from matching `/foobar`).
 *
 * Returns a tuple `[key]` as required by Ant Design's `selectedKeys` prop,
 * falling back to `[fallback]` when no match is found.
 */
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
