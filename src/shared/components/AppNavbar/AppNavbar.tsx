import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n";
import { AppLocaleSwitcher } from "@/i18n";
import AppUserActions from "@/shared/components/AppNavbar/AppHeaderActions/AppUserActions";
import AppThemeToggle from "@/shared/components/AppThemeToggle";

type Props = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

const AppNavbar = ({ collapsed, onToggleCollapse }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();

  const CollapseIcon = collapsed
    ? isRtl
      ? MenuFoldOutlined
      : MenuUnfoldOutlined
    : isRtl
      ? MenuUnfoldOutlined
      : MenuFoldOutlined;

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-(--Grey300) bg-(--app-surface) px-2 md:h-16 md:px-4">
      <div className="flex min-w-0 items-center gap-1">
        <Button
          type="text"
          icon={<CollapseIcon />}
          onClick={onToggleCollapse}
          aria-label={
            collapsed ? t("common.expandSidebar") : t("common.collapseSidebar")
          }
          className="size-10 text-base text-(--app-text) md:size-16"
        />
        <h1 className="truncate text-base font-semibold tracking-tight text-(--app-text) md:text-lg">
          {t("common.appName")}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <AppThemeToggle />
        <AppLocaleSwitcher />
        <AppUserActions />
      </div>
    </header>
  );
};

export default AppNavbar;
