import { AppLocaleSwitcher } from "@/i18n";
import CompanySwitcher from "@/modules/company/components/CompanySwitcher";
import NotificationsBell from "@/modules/user/components/Notifications/NotificationsBell";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import NavbarLogoutAction from "./NavbarLogoutAction";
import NavbarProfileAction from "./NavbarProfileAction";

type Props = {
  logout: () => void | Promise<void>;
  isPending: boolean;
};

const DesktopNavbarActions = ({ logout, isPending }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <CompanySwitcher />
      <NotificationsBell />
      <AppThemeToggle />
      <AppLocaleSwitcher />
      <NavbarProfileAction />
      <NavbarLogoutAction logout={logout} isPending={isPending} />
    </div>
  );
};

export default DesktopNavbarActions;
