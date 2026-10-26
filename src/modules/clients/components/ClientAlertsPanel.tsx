import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import AlertBoard from "@/modules/alerts/components/AlertBoard";
import AlertConfirmDialogs from "@/modules/alerts/components/AlertConfirmDialogs";
import AlertCreateDrawer from "@/modules/alerts/components/AlertCreateDrawer";
import AlertsContentSkeleton from "@/modules/alerts/components/AlertsContentSkeleton";
import { useGetClientAlerts } from "@/modules/alerts/api/hooks/useGetClientAlerts";
import { useAlertsManager } from "@/modules/alerts/hooks/useAlertsManager";
import { ALERTS_ROUTES } from "@/modules/alerts/routes/paths";
import { AlertEntityType, type TAlertUiStatus } from "@/modules/alerts/types";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import type { TClient } from "../types/client";

type Props = {
  client: TClient;
};

const ClientAlertsPanel = ({ client }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const manager = useAlertsManager();
  const [focusedStatus, setFocusedStatus] = useState<TAlertUiStatus | "all">(
    "all",
  );
  const alertsQuery = useGetClientAlerts(client.id);

  const alerts = alertsQuery.data ?? [];

  const toggleFocusedStatus = (status: TAlertUiStatus) => {
    setFocusedStatus((previous) => (previous === status ? "all" : status));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-(--app-text)">
            {t("clients.workspace.sections.alerts")}
          </h2>
          <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
            {t("clients.alerts.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AppButton className="w-fit!" onClick={manager.openCreate}>
            {t("clients.alerts.create")}
          </AppButton>
          <AppButton
            variant="secondary"
            className="w-fit!"
            onClick={() => {
              void navigate(ALERTS_ROUTES.alerts);
            }}
          >
            {t("clients.alerts.openAllAlerts")}
          </AppButton>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 px-4 pt-4 pb-3">
          <h3 className="m-0 text-[15px] font-semibold text-(--app-text)">
            {t("clients.alerts.listTitle")}
          </h3>
          <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
            {alerts.length}
          </span>
          {focusedStatus !== "all" ? (
            <AppButton
              variant="secondary"
              className="ms-auto!"
              onClick={() => setFocusedStatus("all")}
            >
              {t("alerts.board.showAll")}
            </AppButton>
          ) : null}
        </div>

        <div className="px-4 pb-4">
          {alertsQuery.isError ? (
            <div className="flex flex-col gap-3">
              <AppErrorContainer
                error={
                  alertsQuery.error instanceof Error
                    ? alertsQuery.error.message
                    : t("clients.alerts.loadError")
                }
              />
              <AppButton
                variant="secondary"
                loading={alertsQuery.isFetching}
                onClick={() => {
                  void alertsQuery.refetch();
                }}
                className="w-fit!"
              >
                {t("alerts.retry")}
              </AppButton>
            </div>
          ) : alertsQuery.isPending ? (
            <AlertsContentSkeleton viewMode="board" />
          ) : alerts.length === 0 ? (
            <AppEmptyState
              icon={<Bell size={DesignTokens.media.iconMd} />}
              title={t("clients.alerts.emptyTitle")}
              description={t("clients.alerts.emptyDescription")}
            />
          ) : (
            <AlertBoard
              alerts={alerts}
              focusedStatus={focusedStatus}
              actionAlertId={manager.actingAlert?.id}
              actionLoading={manager.isActing}
              onFocusStatus={toggleFocusedStatus}
              onDone={manager.openDone}
              onCancel={manager.openCancel}
              onDelete={manager.openDelete}
            />
          )}
        </div>
      </section>

      <AlertCreateDrawer
        open={manager.drawerOpen}
        form={manager.form}
        loading={manager.isSaving}
        entityId={client.id}
        entityType={AlertEntityType.Client}
        onSubmit={manager.submitAlert}
        onClose={manager.closeDrawer}
      />

      <AlertConfirmDialogs
        kind={manager.confirmKind}
        alert={manager.actingAlert}
        loading={manager.isActing}
        onConfirm={() => {
          void manager.confirmAction();
        }}
        onClose={manager.closeConfirm}
      />
    </div>
  );
};

export default ClientAlertsPanel;
