import { useTranslation } from "react-i18next";
import { LogOutIcon } from "lucide-react";
import clsx from "clsx";
import { AppButton } from "@/shared/ANTD_UIComponents";

type Props = {
  logout: () => void | Promise<void>;
  isPending: boolean;
  showLabel?: boolean;
  onLogout?: () => void;
  className?: string;
};

const NavbarLogoutAction = ({
  logout,
  isPending,
  showLabel = false,
  onLogout,
  className,
}: Props) => {
  const { t } = useTranslation();
  const label = t("common.logout");

  return (
    <AppButton
      variant="default"
      loading={isPending}
      onClick={() => {
        onLogout?.();
        void logout();
      }}
      icon={<LogOutIcon size={18} />}
      aria-label={label}
      title={label}
      className={clsx(showLabel ? "w-full !justify-start" : undefined, className)}
    >
      {showLabel ? label : null}
    </AppButton>
  );
};

export default NavbarLogoutAction;
