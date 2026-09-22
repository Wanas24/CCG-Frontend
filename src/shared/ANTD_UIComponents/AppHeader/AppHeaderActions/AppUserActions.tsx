import { Dropdown, type MenuProps } from "antd";
import { ChevronDown } from "lucide-react";

const userMenuItems: MenuProps["items"] = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  { type: "divider" },
  { key: "logout", label: "Log out" },
];

const AppUserActions = () => {
  return (
    <Dropdown
      menu={{ items: userMenuItems }}
      trigger={["click"]}
      overlayClassName="min-w-[200px]!"
    >
      <div
        role="button"
        tabIndex={0}
        className={`bg-(--Grey400)  rounded-[31px] flex items-center justify-between hover:bg-(--Grey500) transition ease-in-out duration-200 p-1 relative cursor-pointer`}
      >
        <div className="w-8 h-8 bg-(--Primary400) text-sm text-(--Secondary300) rounded-full flex items-center justify-center">
          T E
        </div>
        <span className="scale-80">
          <ChevronDown />
        </span>
        <div className="flex items-center justify-center bg-(--Grey400) w-2 h-2 rounded-full absolute top-6">
          <div className="h-2 w-2 bg-green-400 rounded-full " />
        </div>
      </div>
    </Dropdown>
  );
};

export default AppUserActions;
