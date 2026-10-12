import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import UsersManagerView from "../components/usersManager/UsersManagerView";
import { useUsersManager } from "../hooks/useUsersManager";

const UsersManagerPage = () => {
  const { t } = useTranslation();
  const manager = useUsersManager();

  if (manager.isLoading) {
    return (
      <p className={DesignTokens.typography.muted}>
        {t("userControl.usersManager.loading")}
      </p>
    );
  }

  if (!manager.canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <UsersManagerView manager={manager} />;
};

export default UsersManagerPage;
