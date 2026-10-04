import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import UserControlView from "../components/UserControlView";
import { useUserControl } from "../hooks/useUserControl";
import { useUserControlAccess } from "../hooks/useUserControlAccess";

const UserControlContent = () => {
  const userControl = useUserControl();
  return <UserControlView userControl={userControl} />;
};

const UserControl = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen } = useUserControlAccess();

  if (isLoading) {
    return <p className={DesignTokens.typography.muted}>{t("common.loading")}</p>;
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <UserControlContent />;
};

export default UserControl;
