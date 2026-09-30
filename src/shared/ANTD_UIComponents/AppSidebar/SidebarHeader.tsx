import { memo } from "react";
import { Divider } from "antd";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useSidebar } from "./SidebarContext";
import ERP_SIDEBAR_LOGO from "@/assets/CCG-full-logo-without-bg.png";

const SidebarHeader = memo(function SidebarHeader() {
  const { collapsed } = useSidebar();
  const { t } = useTranslation();
  const brandName = t("common.appName");

  return (
    <div className="flex shrink-0 flex-col gap-2 px-3 pt-3">
      <div
        className={clsx(
          "flex min-w-0 items-center gap-2",
          collapsed ? "justify-center" : "justify-start",
        )}
      >
        <img
          src={ERP_SIDEBAR_LOGO}
          alt={brandName}
          className={clsx(
            DesignTokens.media.avatarSm,
            "shrink-0 object-contain",
          )}
        />

        {!collapsed && (
          <p
            className={clsx(
              "m-0 min-w-0 flex-1 truncate font-semibold text-(--app-surface)",
              DesignTokens.inputs.labelFontSize,
            )}
            title={brandName}
          >
            {brandName}
          </p>
        )}
      </div>

      <div className={clsx(collapsed ? "w-full" : "w-[85%] self-center")}>
        <Divider
          orientation="horizontal"
          className="m-0! bg-(--app-surface)/30!"
        />
      </div>
    </div>
  );
});

export default SidebarHeader;
