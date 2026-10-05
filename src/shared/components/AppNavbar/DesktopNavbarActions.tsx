import { AppLocaleSwitcher } from "@/i18n";
import CompanySwitcher from "@/modules/company/components/CompanySwitcher";
import NotificationsBell from "@/modules/user/components/Notifications/NotificationsBell";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import NavbarLogoutAction from "./NavbarLogoutAction";
import NavbarProfileAction from "./NavbarProfileAction";

type Props = {
  logout: () => void | Promise<void>;
  isPending: boolean;
  iconActionClassName: string;
};

const DesktopNavbarActions = ({
  logout,
  isPending,
  iconActionClassName,
}: Props) => {
  return (
    <div className="flex items-center gap-1">
      <CompanySwitcher />
      <NotificationsBell className={iconActionClassName} />
      <AppThemeToggle className={iconActionClassName} />
      <AppLocaleSwitcher className={iconActionClassName} />
      <NavbarProfileAction className={iconActionClassName} />
      <NavbarLogoutAction
        logout={logout}
        isPending={isPending}
        className={iconActionClassName}
      />
    </div>
  );
};

export default DesktopNavbarActions;
