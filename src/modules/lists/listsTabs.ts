import type { LucideIcon } from "lucide-react";
import { Package, Ruler } from "lucide-react";

export const LISTS_TABS = [
  {
    id: "units",
    labelKey: "lists.tabs.units",
    icon: Ruler,
  },
  {
    id: "itemCatalog",
    labelKey: "lists.tabs.itemCatalog",
    icon: Package,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: string;
  icon: LucideIcon;
}>;

export type ListsTabId = (typeof LISTS_TABS)[number]["id"];
