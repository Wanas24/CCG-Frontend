import { Avatar, Dropdown, type MenuProps } from "antd";
import { LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useLogoutManager } from "@/modules/authentication/hooks/useLogoutManager";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { USER_ROUTES } from "@/modules/user/routes/paths";

const AppUserActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, isPending } = useLogoutManager();
  const user = useAuthStore((state) => state.user);

  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName[0]}.` : ""}`
    : t("common.profile");

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: t("common.profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: t("common.logout"),
      disabled: isPending,
    },
  ];

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate(USER_ROUTES.profile);
      return;
    }

    if (key === "logout") {
      void logout();
    }
  };

  return (
    <Dropdown
      menu={{ items: userMenuItems, onClick: onMenuClick }}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="min-w-[180px]!"
    >
      <button
        type="button"
        aria-label={t("common.profile")}
        className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--Primary300) focus-visible:ring-offset-2 rounded-full"
      >
        <Avatar
          size={36}
          className="bg-(--brand-surface)! text-(--Secondary300)! font-semibold text-sm shrink-0"
          icon={!initials ? <User size={16} /> : undefined}
        >
          {initials || null}
        </Avatar>
        <span className="text-sm font-semibold text-(--app-text) leading-none truncate max-w-28">
          {displayName}
        </span>
      </button>
    </Dropdown>
  );
};

export default AppUserActions;
