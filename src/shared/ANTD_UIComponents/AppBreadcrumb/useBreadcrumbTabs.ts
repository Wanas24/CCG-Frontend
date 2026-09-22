import { useState } from "react";
import type { AppBreadcrumbTab } from "./types";

export function useBreadcrumbTabs(
  initialTabs: AppBreadcrumbTab[],
  initialActivePath: string,
) {
  const [tabs, setTabs] = useState(initialTabs);
  const [activePath, setActivePath] = useState(initialActivePath);

  const handleTabClose = (path: string) => {
    setTabs((current) => {
      const index = current.findIndex((tab) => tab.path === path);
      if (index === -1) {
        return current;
      }

      const nextTabs = current.filter((tab) => tab.path !== path);

      if (activePath === path) {
        const previousTab = current[index - 1];
        setActivePath(previousTab?.path ?? "/");
      }

      return nextTabs;
    });
  };

  const handleClearAll = () => {
    setTabs([]);
    setActivePath("/");
  };

  return {
    tabs,
    activePath,
    setActivePath,
    handleTabClose,
    handleClearAll,
  };
}
