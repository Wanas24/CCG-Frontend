import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import { useLogoutManager } from "@/modules/authentication/hooks/useLogoutManager";
import AppButton from "@/shared/ANTD_UIComponents";
import AppThemeToggle from "@/shared/components/AppThemeToggle";

const AppNavbar = () => {
  const { t } = useTranslation();
  const { logout, isPending } = useLogoutManager();

  return (
    <header className="flex items-center justify-between border-b border-(--Grey300) px-6 py-4">
      <h1 className="text-lg font-semibold text-(--app-text)">
        {t("common.appName")}
      </h1>
      <div className="flex items-center gap-3">
        <AppThemeToggle />
        <AppLocaleSwitcher />
        <AppButton
          className="underline underline-offset-1"
          variant="default"
          loading={isPending}
          onClick={() => void logout()}
        >
          {t("common.logout")}
        </AppButton>
      </div>
    </header>
  );
};

export default AppNavbar;
