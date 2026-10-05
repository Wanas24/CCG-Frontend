import { Dropdown, type MenuProps } from "antd";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { AppThemeMode } from "@/AntdTheme";
import { useThemePreference } from "@/modules/user/hooks/useThemePreference";
import { navbarIconActionClassName } from "@/shared/components/AppNavbar/navbarIconActionClassName";

type Props = {
  showLabel?: boolean;
};

const AppThemeToggle = ({ showLabel = false }: Props) => {
  const { t } = useTranslation();
  const { mode, changeTheme } = useThemePreference();
  const label = t("common.theme");

  const items: MenuProps["items"] = [
    {
      key: "light",
      label: t("common.lightMode"),
      icon: <Sun size={16} />,
      onClick: () => changeTheme("light" satisfies AppThemeMode),
    },
    {
      key: "dark",
      label: t("common.darkMode"),
      icon: <Moon size={16} />,
      onClick: () => changeTheme("dark" satisfies AppThemeMode),
    },
    {
      key: "system",
      label: t("common.systemMode"),
      icon: <Monitor size={16} />,
      onClick: () => changeTheme("system" satisfies AppThemeMode),
    },
  ];

  const triggerIcon =
    mode === "dark" ? (
      <Moon size={18} />
    ) : mode === "system" ? (
      <Monitor size={18} />
    ) : (
      <Sun size={18} />
    );

  const trigger = (
    <AppButton
      variant="default"
      aria-label={label}
      aria-haspopup="menu"
      iconPlacement={"start"}
      className={clsx(
        showLabel
          ? "w-full !justify-start hover:bg-(--Grey100)!"
          : navbarIconActionClassName,
      )}
      icon={triggerIcon}
    >
      {showLabel ? label : null}
    </AppButton>
  );

  return (
    <Dropdown menu={{ items, selectedKeys: [mode] }} trigger={["click"]}>
      {showLabel ? <span className="block w-full">{trigger}</span> : trigger}
    </Dropdown>
  );
};

export default AppThemeToggle;
