import { Navigate, Outlet, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import { AppButton, AppSkeleton } from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import {
  selectClientFromListResponse,
  useGetClientById,
} from "../api/hooks/useGetClientById";
import ClientDeleteDialog from "../components/ClientDeleteDialog";
import ClientWorkspaceHeader from "../components/ClientWorkspaceHeader";
import ClientWorkspaceNav from "../components/ClientWorkspaceNav";
import { useClientsAccess } from "../hooks/useClientsAccess";
import { useDeleteClientManager } from "../hooks/useDeleteClientManager";
import { CLIENTS_ROUTES } from "../routes/paths";
import type { TClientWorkspaceOutletContext } from "../types/workspaceOutlet";
import { parseClientRouteId } from "../utils/parseClientRouteId";

const ClientWorkspaceLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientId: clientIdParam } = useParams();
  const clientId = parseClientRouteId(clientIdParam);
  const { isLoading: accessLoading, canOpen } = useClientsAccess();
  const deleteManager = useDeleteClientManager();
  const clientQuery = useGetClientById(
    clientId,
    canOpen &&
      clientId != null &&
      deleteManager.cleanupClientId !== clientId,
  );

  if (accessLoading) {
    return (
      <div className="flex flex-col gap-3">
        <AppSkeleton.Input active className="!h-8 !w-48 !min-w-48" />
        <p className={DesignTokens.typography.muted}>
          {t("clients.workspace.loading")}
        </p>
      </div>
    );
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  if (clientId == null) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer error={t("clients.workspace.invalidId")} />
        <AppButton
          variant="secondary"
          className="w-fit!"
          onClick={() => navigate(CLIENTS_ROUTES.root)}
        >
          {t("clients.workspace.back")}
        </AppButton>
      </div>
    );
  }

  const response = clientQuery.data;
  const matched = selectClientFromListResponse(response, clientId);

  if (clientQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-5">
          <AppSkeleton.Input active className="!mb-3 !h-8 !w-20 !min-w-20" />
          <AppSkeleton.Input active className="!mb-2 !h-8 !w-64 !min-w-48" />
          <AppSkeleton.Input active className="!h-4 !w-48 !min-w-40" />
        </div>
        <p className={DesignTokens.typography.muted}>
          {t("clients.workspace.loading")}
        </p>
      </div>
    );
  }

  if (clientQuery.isError || (response && !response.isSuccess)) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer
          error={response?.message ?? t("clients.workspace.loadError")}
        />
        <div className="flex flex-wrap gap-2">
          <AppButton
            variant="secondary"
            loading={clientQuery.isFetching}
            onClick={() => {
              void clientQuery.refetch();
            }}
            className="w-fit!"
          >
            {t("clients.retry")}
          </AppButton>
          <AppButton
            variant="secondary"
            className="w-fit!"
            onClick={() => navigate(CLIENTS_ROUTES.root)}
          >
            {t("clients.workspace.back")}
          </AppButton>
        </div>
      </div>
    );
  }

  if (!matched) {
    return (
      <div className="flex flex-col gap-3">
        <AppErrorContainer error={t("clients.workspace.notFound")} />
        <AppButton
          variant="secondary"
          className="w-fit!"
          onClick={() => navigate(CLIENTS_ROUTES.root)}
        >
          {t("clients.workspace.back")}
        </AppButton>
      </div>
    );
  }

  const outletContext: TClientWorkspaceOutletContext = { client: matched };

  return (
    <div className="flex flex-col gap-4">
      <ClientWorkspaceHeader
        client={matched}
        canDelete={deleteManager.canDelete}
        onDelete={() => deleteManager.openDelete(matched)}
      />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <ClientWorkspaceNav clientId={clientId} />
        <section className="min-h-64 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 sm:p-5">
          <Outlet context={outletContext} />
        </section>
      </div>
      <ClientDeleteDialog
        client={deleteManager.deletingClient}
        loading={deleteManager.isDeleting}
        onConfirm={() => {
          void deleteManager.confirmDelete();
        }}
        onClose={deleteManager.closeDelete}
      />
    </div>
  );
};

export default ClientWorkspaceLayout;
