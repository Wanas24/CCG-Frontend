import { Dropdown, type MenuProps } from "antd";
import { LogOutIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetMe } from "@/modules/user/api/hooks/useGetMe";
import { USER_ROUTES } from "@/modules/user/routes/paths";
import { AppButton } from "@/shared/ANTD_UIComponents";
import NavbarUserAvatar from "./NavbarUserAvatar";

type Props = {
  logout: () => void | Promise<void>;
  isPending: boolean;
};

const NavbarUserMenu = ({ logout, isPending }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const { data } = useGetMe();
  const profile = data?.isSuccess ? data.data : undefined;
  const profileImage = profile?.profileImage ?? null;
  const imageAlt = t("user.profile.imageAlt");
  const menuLabel = t("user.profile.menuAriaLabel");
  const profileLabel = t("user.profile.navLabel");
  const logoutLabel = t("common.logout");
  const displayName =
    [
      profile?.firstName ?? authUser?.firstName,
      profile?.lastName ?? authUser?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || profileLabel;

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: profileLabel,
      icon: <UserIcon size={DesignTokens.media.iconSm} />,
    },
    {
      key: "logout",
      label: logoutLabel,
      icon: <LogOutIcon size={DesignTokens.media.iconSm} />,
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
      menu={{ items, onClick: onMenuClick }}
      trigger={["click"]}
      placement={isRtl ? "bottomLeft" : "bottomRight"}
    >
      <AppButton
        variant="default"
        padding="none"
        aria-label={menuLabel}
        aria-haspopup="menu"
        title={displayName}
        icon={
          <NavbarUserAvatar
            profileImage={profileImage}
            alt={imageAlt}
            className="size-9! rounded-lg"
          />
        }
        className={clsx(
          "size-9! shrink-0 overflow-hidden! rounded-lg! border-0! bg-transparent!",
          "hover:bg-transparent! hover:opacity-90!",
          "[&_.ant-btn-icon]:m-0! [&_.ant-btn-icon]:size-9! [&_.ant-btn-icon]:overflow-hidden!",
        )}
      />
    </Dropdown>
  );
};

export default NavbarUserMenu;
