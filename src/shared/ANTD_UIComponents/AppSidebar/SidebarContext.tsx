import { createContext, useContext } from "react";
import type React from "react";
import type { MenuItemConfig, SidebarContextValue } from "./types";

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      "[AppSidebar] useSidebar must be called inside a <SidebarProvider>.",
    );
  }
  return ctx;
}

interface SidebarProviderProps {
  collapsed: boolean;
  onToggle: () => void;
  isRtl: boolean;
  menuConfig: MenuItemConfig[];
  permissions: string[];
  onNavigate?: () => void;
  children: React.ReactNode;
}

export function SidebarProvider({
  collapsed,
  onToggle,
  isRtl,
  menuConfig,
  permissions,
  onNavigate,
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
        onNavigate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
