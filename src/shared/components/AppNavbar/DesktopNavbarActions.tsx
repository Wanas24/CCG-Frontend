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

const navbarIconActionClassName =
  "size-9! shrink-0 justify-center! rounded-lg! border! border-(--Grey300)! px-0! hover:bg-(--Grey100)!";

const DesktopNavbarActions = ({ logout, isPending }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <CompanySwitcher />
      <NotificationsBell className={navbarIconActionClassName} />
      <AppThemeToggle className={navbarIconActionClassName} />
      <AppLocaleSwitcher className={navbarIconActionClassName} />
      <NavbarProfileAction />
      <NavbarLogoutAction logout={logout} isPending={isPending} />
    </div>
  );
};

export default DesktopNavbarActions;
