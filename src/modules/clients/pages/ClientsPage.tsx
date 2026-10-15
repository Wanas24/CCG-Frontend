import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import {
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import ClientsList from "../components/ClientsList";
import { useClientsAccess } from "../hooks/useClientsAccess";

const ClientsPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen } = useClientsAccess();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <AppSkeleton.Input active className="!h-8 !w-48 !min-w-48" />
        <p className={DesignTokens.typography.muted}>{t("clients.loading")}</p>
      </div>
    );
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return (
    <div>
      <AppFormPage title={t("clients.title")} className="min-w-0 gap-4!">
        <AppFormSection className="min-w-0 gap-4!">
          <p className={`m-0 ${DesignTokens.typography.muted}`}>
            {t("clients.subtitle")}
          </p>
          <ClientsList />
        </AppFormSection>
      </AppFormPage>
    </div>
  );
};

export default ClientsPage;
