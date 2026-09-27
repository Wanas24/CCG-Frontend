import { Switch } from "antd";
import { Moon, Sun } from "lucide-react";
import { useThemePreference } from "@/modules/user/hooks/useThemePreference";

const AppThemeToggle = () => {
  const { mode, toggleTheme } = useThemePreference();

  return (
    <Switch
      checked={mode === "dark"}
      onChange={toggleTheme}
      checkedChildren={<Moon size={12} />}
      unCheckedChildren={<Sun size={12} />}
      className="cursor-pointer!"
    />
  );
};

export default AppThemeToggle;
