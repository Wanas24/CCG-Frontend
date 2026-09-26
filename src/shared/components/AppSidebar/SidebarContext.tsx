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

type SidebarProviderProps = {
  collapsed: boolean;
  onToggle: () => void;
  menuConfig: MenuItemConfig[];
  permissions: string[];
  children: React.ReactNode;
};

export function SidebarProvider({
  collapsed,
  onToggle,
  menuConfig,
  permissions,
  children,
}: SidebarProviderProps) {
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleCollapse: onToggle,
        menuConfig,
        permissions,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
