import { useTranslation } from "react-i18next";
import { AppLocaleSwitcher } from "@/i18n";
import AppThemeToggle from "@/shared/components/AppThemeToggle";
import AppButton from "@/shared/ANTD_UIComponents";
import { useNavigate } from "react-router";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

const AppNavbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
          onClick={() => {
            localStorage.removeItem("ALHARMEEN_TOKEN");
            navigate(AUTH_ROUTES.login);
          }}
        >
          {/* Dummy */}
          Logout
        </AppButton>
      </div>
    </header>
  );
};

export default AppNavbar;
