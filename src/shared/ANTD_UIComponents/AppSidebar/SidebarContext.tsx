import { createContext, useContext } from "react";
import type React from "react";
import type { MenuItemConfig, SidebarContextValue } from "./types";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SidebarContext = createContext<SidebarContextValue | null>(null);

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

/**
 * Returns the nearest SidebarContext value.
 * Throws a descriptive error when used outside of a <SidebarProvider>.
 */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      "[AppSidebar] useSidebar must be called inside a <SidebarProvider>.",
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface SidebarProviderProps {
  collapsed: boolean;
  onToggle: () => void;
  isRtl: boolean;
  menuConfig: MenuItemConfig[];
  permissions: string[];
  children: React.ReactNode;
}

/**
 * Wraps the sidebar subtree and exposes shared state to every child via
 * context — eliminates prop drilling across sub-components.
 */
export function SidebarProvider({
  collapsed,
  onToggle,
  isRtl,
  menuConfig,
  permissions,
  children,
}: SidebarProviderProps) {
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapse: onToggle,
        isRtl,
        menuConfig,
        permissions,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
