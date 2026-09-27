import { Dropdown, type MenuProps } from "antd";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { AppThemeMode } from "@/AntdTheme";
import { useThemePreference } from "@/modules/user/hooks/useThemePreference";

const AppThemeToggle = () => {
  const { t } = useTranslation();
  const { mode, changeTheme } = useThemePreference();

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

  return (
    <Dropdown menu={{ items, selectedKeys: [mode] }} trigger={["click"]}>
      <AppButton
        variant="default"
        aria-label={t("common.theme")}
        icon={triggerIcon}
      />
    </Dropdown>
  );
};

export default AppThemeToggle;
