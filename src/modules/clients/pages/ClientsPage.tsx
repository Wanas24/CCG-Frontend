import { Plus } from "lucide-react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import {
  AppButton,
  AppFormPage,
  AppFormSection,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import ClientsList from "../components/ClientsList";
import CreateClientDrawer from "../components/CreateClientDrawer";
import { useClientsAccess } from "../hooks/useClientsAccess";
import { useCreateClientManager } from "../hooks/useCreateClientManager";

const ClientsPage = () => {
  const { t } = useTranslation();
  const { isLoading, canOpen, canCreate } = useClientsAccess();
  const createManager = useCreateClientManager();

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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className={`m-0 ${DesignTokens.typography.muted}`}>
              {t("clients.subtitle")}
            </p>
            {canCreate ? (
              <AppButton
                className="w-fit!"
                icon={<Plus size={16} />}
                onClick={createManager.openCreate}
              >
                {t("clients.form.create")}
              </AppButton>
            ) : null}
          </div>
          <ClientsList />
        </AppFormSection>
      </AppFormPage>
      {canCreate ? (
        <CreateClientDrawer
          open={createManager.drawerOpen}
          form={createManager.form}
          loading={createManager.isSaving}
          onSubmit={createManager.submitCreate}
          onClose={createManager.closeDrawer}
        />
      ) : null}
    </div>
  );
};

export default ClientsPage;
