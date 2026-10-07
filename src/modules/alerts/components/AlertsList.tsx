import { useMemo } from "react";
import { Input } from "antd";
import { useTranslation } from "react-i18next";
import { Info, SearchX } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetMyAlerts } from "../api/hooks/useGetMyAlerts";
import { useAlertsListState } from "../hooks/useAlertsListState";
import { useAlertsManager } from "../hooks/useAlertsManager";
import { getAlertUiStatus } from "../utils/alertStatus";
import { extractAlertPage } from "../utils/extractAlertPage";
import { normalizeAlert } from "../utils/normalizeAlert";
import AlertBoard from "./AlertBoard";
import AlertConfirmDialogs from "./AlertConfirmDialogs";
import AlertCreateDrawer from "./AlertCreateDrawer";
import AlertTimeline from "./AlertTimeline";

const AlertsList = () => {
  const { t } = useTranslation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const listState = useAlertsListState();
  const manager = useAlertsManager();
  const { data, isPending, isError, isFetching, refetch } = useGetMyAlerts(
    listState.params,
  );

  const { rows: rawRows, totalCount } = extractAlertPage(data);

  const boardAlerts = useMemo(() => {
    let rows = rawRows.map(normalizeAlert);

    if (listState.mineOnly && currentUserId) {
      rows = rows.filter(
        (alert) =>
          alert.createdById &&
          String(alert.createdById) === String(currentUserId),
      );
    }

    return rows;
  }, [rawRows, listState.mineOnly, currentUserId]);

  const timelineAlerts = useMemo(() => {
    if (listState.focusedStatus === "all") return boardAlerts;
    return boardAlerts.filter(
      (alert) => getAlertUiStatus(alert) === listState.focusedStatus,
    );
  }, [boardAlerts, listState.focusedStatus]);

  const visibleCount =
    listState.focusedStatus === "all"
      ? boardAlerts.length
      : timelineAlerts.length;

  const boardTitle =
    listState.focusedStatus === "all"
      ? t("alerts.board.reminders")
      : t(`alerts.status.${listState.focusedStatus}`);

  const boardHint =
    listState.hasSearch || listState.mineOnly
      ? t("alerts.board.shownCount", { count: visibleCount })
      : t("alerts.board.remindersCount", { count: visibleCount });

  const isFiltered =
    listState.hasSearch ||
    listState.mineOnly ||
    listState.focusedStatus !== "all";

  const showFilteredEmpty =
    !isPending &&
    !isError &&
    !(data && !data.isSuccess) &&
    boardAlerts.length === 0 &&
    isFiltered;

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="inline-flex w-fit flex-wrap gap-0.5 rounded-xl border border-(--Grey300) bg-(--Grey100) p-1">
            {(["board", "timeline"] as const).map((mode) => {
              const active = listState.viewMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  className={
                    active
                      ? "rounded-lg bg-linear-to-r from-(--Primary300) to-(--Secondary300) px-3 py-1.5 text-sm font-semibold text-white"
                      : "rounded-lg px-3 py-1.5 text-sm font-semibold text-(--Grey600)"
                  }
                  onClick={() => listState.setViewMode(mode)}
                >
                  {t(`alerts.views.${mode}`)}
                </button>
              );
            })}
          </div>

          <Input
            allowClear
            value={listState.searchInput}
            onChange={(event) => listState.setSearchInput(event.target.value)}
            placeholder={t("alerts.searchPlaceholder")}
            aria-label={t("alerts.searchPlaceholder")}
            className="w-full! sm:min-w-55 sm:flex-1!"
          />
          <button
            type="button"
            className={
              listState.mineOnly
                ? "rounded-xl border-0 bg-linear-to-br from-(--Primary300) to-(--Secondary300) px-3.5 py-2 text-sm font-semibold text-white"
                : "rounded-xl border border-(--Grey300) bg-(--app-surface) px-3.5 py-2 text-sm font-semibold text-(--app-text)"
            }
            disabled={!currentUserId}
            onClick={() => listState.setMineOnly(!listState.mineOnly)}
          >
            {t("alerts.board.createdByMe")}
          </button>
          <AppButton onClick={manager.openCreate} className="w-full! sm:w-fit!">
            {t("alerts.create")}
          </AppButton>
        </div>
      </div>

      {listState.viewMode === "board" ? (
        <p className="mb-4 mt-0 flex items-center gap-1.5 text-xs text-(--Grey600)">
          <Info size={14} className="shrink-0" aria-hidden />
          <span>{t("alerts.board.focusTip")}</span>
        </p>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 px-4 pt-4 pb-3">
          <h2 className="m-0 text-[15px] font-semibold text-(--app-text)">
            {boardTitle}
          </h2>
          <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
            {visibleCount}
          </span>
          <span className={`text-xs ${DesignTokens.typography.muted}`}>
            {boardHint}
          </span>
          {listState.focusedStatus !== "all" ? (
            <AppButton
              variant="secondary"
              className="ms-auto!"
              onClick={listState.clearFocusedStatus}
            >
              {t("alerts.board.showAll")}
            </AppButton>
          ) : null}
        </div>

        <div className="px-4 pb-4">
          {isError || (data && !data.isSuccess) ? (
            <div className="flex flex-col gap-3">
              <AppErrorContainer
                error={data?.message ?? t("alerts.loadError")}
              />
              <AppButton
                variant="secondary"
                loading={isFetching}
                onClick={() => {
                  void refetch();
                }}
                className="w-fit!"
              >
                {t("alerts.retry")}
              </AppButton>
            </div>
          ) : isPending ? (
            <p className={`m-0 ${DesignTokens.typography.muted}`}>
              {t("common.loading")}
            </p>
          ) : showFilteredEmpty ? (
            <AppEmptyState
              icon={<SearchX size={DesignTokens.media.iconMd} />}
              title={t("alerts.emptySearchTitle")}
              description={t("alerts.emptySearchDescription")}
            />
          ) : listState.viewMode === "timeline" ? (
            <AlertTimeline
              alerts={timelineAlerts}
              actionAlertId={manager.actingAlert?.id}
              actionLoading={manager.isActing}
              onDone={manager.openDone}
              onCancel={manager.openCancel}
              onDelete={manager.openDelete}
            />
          ) : (
            <AlertBoard
              alerts={boardAlerts}
              focusedStatus={listState.focusedStatus}
              actionAlertId={manager.actingAlert?.id}
              actionLoading={manager.isActing}
              onFocusStatus={listState.toggleFocusedStatus}
              onDone={manager.openDone}
              onCancel={manager.openCancel}
              onDelete={manager.openDelete}
            />
          )}
        </div>
      </section>

      {totalCount > (listState.params.pageSize ?? 100) ? (
        <p className={`mt-3 mb-0 text-xs ${DesignTokens.typography.muted}`}>
          {t("alerts.board.truncatedHint", {
            shown: rawRows.length,
            total: totalCount,
          })}
        </p>
      ) : null}

      <AlertCreateDrawer
        open={manager.drawerOpen}
        form={manager.form}
        loading={manager.isSaving}
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

export default AlertsList;
