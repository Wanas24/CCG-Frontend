import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import AppUserActions from "@/shared/components/AppNavbar/AppHeaderActions/AppUserActions";
import AppThemeToggle from "@/shared/components/AppThemeToggle";

const AppNavbar = () => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between border-b border-(--Grey300) px-6 py-4">
      <h1 className="text-lg font-semibold text-(--app-text)">
        {t("common.appName")}
      </h1>
      <div className="flex items-center gap-3">
        <AppThemeToggle />
        <AppLocaleSwitcher />
        <AppUserActions />
      </div>
    </header>
  );
};

export default AppNavbar;
