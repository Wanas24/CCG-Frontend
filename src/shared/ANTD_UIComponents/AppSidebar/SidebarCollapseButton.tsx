import { memo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useSidebar } from "./SidebarContext";

const SidebarCollapseButton = memo(function SidebarCollapseButton() {
  const { collapsed, toggleCollapse, isRtl } = useSidebar();

  const showLeftChevron = collapsed === isRtl;

  return (
    <button
      type="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggleCollapse}
      className={[
        "absolute top-[9%] z-20",
        "flex h-10 w-[22px] items-center justify-center",
        "bg-(--Primary400) text-white",
        "cursor-pointer transition-all duration-200",
        isRtl
          ? "right-full rounded-s-md"
          : "left-full rounded-e-md",
      ].join(" ")}
    >
      {showLeftChevron ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
});

export default SidebarCollapseButton;