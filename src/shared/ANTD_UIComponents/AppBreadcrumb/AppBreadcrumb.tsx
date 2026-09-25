import { useEffect, useState, type MouseEvent } from "react";
import { Divider, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ClearOutlined, HomeOutlined, MoreOutlined } from "@ant-design/icons";
import { X } from "lucide-react";
import { Link } from "react-router";
import clsx from "clsx";
import type { AppBreadcrumbProps } from "./types";

function getMaxTabsForWidth(width: number) {
  if (width < 640) return 2;
  if (width < 768) return 3;
  if (width < 1024) return 5;
  if (width < 1280) return 6;
  if (width < 1536) return 8;
  if (width < 1920) return 10;
  return 12;
}

function useResponsiveMaxTabs(override?: number) {
  const [maxVisibleTabs, setMaxVisibleTabs] = useState(() =>
    getMaxTabsForWidth(window.innerWidth),
  );

  useEffect(() => {
    if (override !== undefined) {
      return;
    }

    const updateMaxTabs = () => {
      setMaxVisibleTabs(getMaxTabsForWidth(window.innerWidth));
    };

    window.addEventListener("resize", updateMaxTabs);

    return () => window.removeEventListener("resize", updateMaxTabs);
  }, [override]);

  return override ?? maxVisibleTabs;
}

export function AppBreadcrumb({
  tabs,
  activePath,
  onTabClick,
  onTabClose,
  onClearAll,
  homeTitle = "Home",
  detailsLabel = "Details",
  clearAllLabel = "Clear all tabs",
  maxVisibleTabs: maxVisibleTabsOverride,
  className,
}: AppBreadcrumbProps) {
  const maxVisibleTabs = useResponsiveMaxTabs(maxVisibleTabsOverride);

  const breadcrumbItems = [{ path: "/", title: homeTitle }, ...tabs];

  const visibleItems = breadcrumbItems.slice(0, maxVisibleTabs);
  const hiddenItems = breadcrumbItems.slice(maxVisibleTabs);

  const isActiveInMore = hiddenItems.some((item) => activePath === item.path);

  const renderTabLabel = (
    item: { path: string; title: string },
    isActive: boolean,
  ) => {
    const labelClassName = clsx(
      "font-semibold whitespace-nowrap max-w-[120px] truncate",
      isActive ? "text-(--app-text)" : "text-(--Grey900)",
    );

    if (onTabClick) {
      return (
        <button
          type="button"
          title={item.title}
          onClick={() => onTabClick(item.path)}
          className={clsx(
            labelClassName,
            "cursor-pointer bg-transparent border-0 p-0",
          )}
        >
          {item.path === "/" ? <HomeOutlined /> : item.title}
        </button>
      );
    }

    return (
      <Link title={item.title} to={item.path} className={labelClassName}>
        {item.path === "/" ? <HomeOutlined /> : item.title}
      </Link>
    );
  };

  const handleTabClose = (path: string) => (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onTabClose?.(path);
  };

  const overflowMenu: MenuProps["items"] = hiddenItems.map((item) => {
    const isActive = activePath === item.path;

    return {
      key: item.path,
      className: isActive ? "bg-(--Primary100)" : "",
      label: (
        <div className="flex min-w-[150px] items-center justify-between gap-3">
          {onTabClick ? (
            <button
              type="button"
              onClick={() => onTabClick(item.path)}
              className={clsx(
                "flex-1 cursor-pointer bg-transparent border-0 p-0 text-left font-semibold",
                isActive ? "text-(--app-text)" : "text-(--Grey900)",
              )}
            >
              {item.title}
            </button>
          ) : (
            <Link
              to={item.path}
              className={clsx(
                "flex-1 font-semibold",
                isActive ? "text-(--app-text)" : "text-(--Grey900)",
              )}
            >
              {item.title}
            </Link>
          )}
          {item.path !== "/" && onTabClose && (
            <X
              className={clsx(
                "shrink-0 cursor-pointer rounded-full hover:bg-(--Grey800)/20",
                isActive ? "text-(--Grey900)" : "text-(--Grey600)",
              )}
              size={16}
              onClick={handleTabClose(item.path)}
            />
          )}
        </div>
      ),
    };
  });

  const contextMenuItems: MenuProps["items"] = [
    {
      key: "details",
      label: detailsLabel,
      disabled: true,
    },
    {
      key: "divider",
      label: <Divider className="my-0!" />,
      disabled: true,
    },
    {
      key: "clear-all",
      label: clearAllLabel,
      icon: <ClearOutlined />,
      onClick: onClearAll,
      disabled: tabs.length === 0 || !onClearAll,
    },
  ];

  return (
    <Dropdown menu={{ items: contextMenuItems }} trigger={["contextMenu"]}>
      <div
        className={clsx(
          " w-full overflow-hidden bg-(--app-surface)",
          className,
        )}
      >
        <div className="flex items-center gap-0">
          {visibleItems.map((item, index) => {
            const isActive = activePath === item.path;
            const isHome = item.path === "/";
            const showCloseButton = !isHome && Boolean(onTabClose);
            const isLast = index === visibleItems.length - 1;

            return (
              <div key={item.path} className="flex shrink-0 items-center">
                <div className="relative flex flex-col items-center justify-center overflow-hidden">
                  <div
                    className={clsx(
                      "mb-1 flex h-[35px] items-center justify-center gap-1 rounded-t-[8px] px-2",
                      isActive
                        ? "hover:bg-(--Primary100)"
                        : "hover:bg-(--Grey200)",
                    )}
                  >
                    {renderTabLabel(item, isActive)}
                    {showCloseButton && (
                      <X
                        className={clsx(
                          "cursor-pointer rounded-full hover:bg-(--Grey800)/20 hover:text-(--app-text) transition-all duration-300",
                          isActive ? "text-(--Grey900)" : "text-(--Grey600)",
                        )}
                        size={19}
                        onClick={handleTabClose(item.path)}
                      />
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-1 h-2 w-full rounded-t-lg bg-(--Primary300)" />
                  )}
                </div>

                {!isLast && (
                  <Divider
                    orientation="vertical"
                    className="mx-1 h-full bg-(--Grey400)!"
                  />
                )}
              </div>
            );
          })}

          {hiddenItems.length > 0 && (
            <>
              <Divider
                orientation="vertical"
                className="mx-1 h-[35px] bg-(--Grey400)!"
              />
              <Dropdown
                menu={{ items: overflowMenu }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="relative flex flex-col items-center justify-center overflow-hidden">
                  <div
                    className={clsx(
                      "mb-1 flex h-[35px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-t-[8px] px-3",
                      isActiveInMore
                        ? "hover:bg-(--Primary100)"
                        : "hover:bg-(--Grey200)",
                    )}
                  >
                    <MoreOutlined
                      className={clsx(
                        "text-lg",
                        isActiveInMore
                          ? "text-(--app-text)"
                          : "text-(--Grey900)",
                      )}
                    />
                    <span
                      className={clsx(
                        "text-sm",
                        isActiveInMore
                          ? "font-bold text-(--app-text)"
                          : "font-semibold text-(--Grey900)",
                      )}
                    >
                      +{hiddenItems.length}
                    </span>
                  </div>
                  {isActiveInMore && (
                    <div className="absolute -bottom-1 h-2 w-full rounded-t-lg bg-(--Primary300)" />
                  )}
                </div>
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </Dropdown>
  );
}

export default AppBreadcrumb;
