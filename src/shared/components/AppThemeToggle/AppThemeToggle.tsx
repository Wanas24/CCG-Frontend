import { Switch } from "antd";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/AntdTheme";

const AppThemeToggle = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return (
    <Switch
      checked={mode === "dark"}
      onChange={toggleMode}
      checkedChildren={<Moon size={12} />}
      unCheckedChildren={<Sun size={12} />}
      className="cursor-pointer!"
    />
  );
};

export default AppThemeToggle;
