import { AppLocaleSwitcher } from "@/i18n";
import CompanySwitcher from "@/modules/company/components/CompanySwitcher";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import NavbarAiSubscriptionsAction from "./NavbarAiSubscriptionsAction";
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
      <NavbarAiSubscriptionsAction />
      <AppThemeToggle />
      <AppLocaleSwitcher />
      <NavbarProfileAction />
      <NavbarLogoutAction logout={logout} isPending={isPending} />
    </div>
  );
};

export default DesktopNavbarActions;
