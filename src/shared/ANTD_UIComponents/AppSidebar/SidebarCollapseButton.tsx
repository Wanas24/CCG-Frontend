import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "./SidebarContext";

const SidebarCollapseButton = memo(function SidebarCollapseButton() {
  const { collapsed, toggleCollapse, isRtl } = useSidebar();

  const showLeftChevron = collapsed === isRtl;

  return (
    <div
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && toggleCollapse()}
      onClick={toggleCollapse}
      className={[
        "absolute top-0 bottom-0",
        isRtl ? "left-0" : "right-0",
        collapsed ? "w-[14%]" : "w-[7%]",
        "text-white font-bold cursor-pointer",
        isRtl ? "border-l-3" : "border-r-3",
        "hover:border-(--Primary300) border-(--Primary400) transition-all duration-200",
      ].join(" ")}
    >
      <div
        className={[
          "absolute top-[9%]",
          "flex justify-center items-center",
          isRtl ? "rounded-tr-lg rounded-br-lg" : "rounded-tl-lg rounded-bl-lg",
          "py-5 bg-(--Primary300) h-12 w-full",
        ].join(" ")}
      >
        {showLeftChevron ? (
          <ChevronLeft className="text-xl" />
        ) : (
          <ChevronRight className="text-xl" />
        )}
      </div>
    </div>
  );
});

export default SidebarCollapseButton;
