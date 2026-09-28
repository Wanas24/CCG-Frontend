import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import CompanySwitcher from "@/modules/company/components/CompanySwitcher";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import NavbarLogoutAction from "./NavbarLogoutAction";
import NavbarProfileAction from "./NavbarProfileAction";

type Props = {
  logout: () => void | Promise<void>;
  isPending: boolean;
  onNavigate: () => void;
};

const MobileNavbarMenu = ({ logout, isPending, onNavigate }: Props) => {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col items-start  gap-3" aria-label={t("common.menu")}>
      <CompanySwitcher />
      <NavbarProfileAction showLabel onNavigate={onNavigate} />
      <AppLocaleSwitcher showLabel />
      <AppThemeToggle showLabel />
      <NavbarLogoutAction
        logout={logout}
        isPending={isPending}
        showLabel
        onLogout={onNavigate}
      />
    </nav>
  );
};

export default MobileNavbarMenu;
