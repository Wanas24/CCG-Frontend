import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import { useLogoutManager } from "@/modules/authentication/hooks/useLogoutManager";
import { USER_ROUTES } from "@/modules/user/routes/paths";
import CompanySwitcher from "@/modules/company/components/CompanySwitcher";
import AppButton from "@/shared/ANTD_UIComponents";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import { LogOutIcon, UserIcon } from "lucide-react";

const AppNavbar = () => {
  const { t } = useTranslation();
  const { logout, isPending } = useLogoutManager();

  return (
    <header className="flex items-center justify-between border-b border-(--Grey300) px-6 py-4">
      <h1 className="text-lg font-semibold text-(--app-text)">
        {t("common.appName")}
      </h1>
      <div className="flex items-center gap-1">
        <CompanySwitcher />
        <AppThemeToggle />
        <AppLocaleSwitcher />
        <Link to={USER_ROUTES.profile}>
          <AppButton
            variant="default"
            icon={<UserIcon size={18} />}
            aria-label={t("user.profile.navLabel")}
          />
        </Link>
        <AppButton
          variant="default"
          loading={isPending}
          onClick={() => void logout()}
          icon={<LogOutIcon size={18} />}
          aria-label={t("common.logout")}
          title={t("common.logout")}
        />
      </div>
    </header>
  );
};

export default AppNavbar;
