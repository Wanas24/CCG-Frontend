import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { TAlert, TAlertUiStatus } from "../types";
import { getAlertUiStatus } from "../utils/alertStatus";
import {
  ALERT_STATUS_DOT_CLASS,
  ALERT_STATUS_ORDER,
} from "../utils/alertStatusStyles";
import AlertCard from "./AlertCard";

type Props = {
  alerts: TAlert[];
  focusedStatus: TAlertUiStatus | "all";
  actionAlertId?: number | null;
  actionLoading?: boolean;
  onFocusStatus: (status: TAlertUiStatus) => void;
  onDone: (alert: TAlert) => void;
  onCancel: (alert: TAlert) => void;
  onDelete: (alert: TAlert) => void;
};

const AlertBoard = ({
  alerts,
  focusedStatus,
  actionAlertId,
  actionLoading,
  onFocusStatus,
  onDone,
  onCancel,
  onDelete,
}: Props) => {
  const { t } = useTranslation();

  const grouped = ALERT_STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = alerts.filter(
        (alert) => getAlertUiStatus(alert) === status,
      );
      return acc;
    },
    {
      live: [] as TAlert[],
      scheduled: [] as TAlert[],
      done: [] as TAlert[],
      canceled: [] as TAlert[],
    },
  );

  if (focusedStatus !== "all") {
    const focusedAlerts = grouped[focusedStatus];
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {focusedAlerts.length ? (
          focusedAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              actionLoading={actionLoading && actionAlertId === alert.id}
              onDone={onDone}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="m-0 py-8 text-center text-sm text-(--Grey600) sm:col-span-2 xl:col-span-3">
            {t("alerts.board.none")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-3.5 overflow-x-auto pb-1">
      {ALERT_STATUS_ORDER.map((status) => {
        const laneAlerts = grouped[status];
        return (
          <section
            key={status}
            className="min-h-[220px] rounded-2xl border border-(--Grey300) bg-(--Grey100)"
          >
            <header className="flex items-center gap-2 p-3">
              <i
                className={clsx(
                  "size-2.5 shrink-0 rounded-full",
                  ALERT_STATUS_DOT_CLASS[status],
                )}
                aria-hidden
              />
              <button
                type="button"
                className="m-0 flex min-w-0 flex-1 items-center gap-2 bg-transparent p-0 text-start"
                onClick={() => onFocusStatus(status)}
                title={t("alerts.board.focusTip")}
              >
                <h3 className="m-0 truncate text-sm font-semibold text-(--app-text)">
                  {t(`alerts.status.${status}`)}
                </h3>
              </button>
              <button
                type="button"
                className="rounded-full border border-(--Grey300) bg-(--app-surface) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)"
                onClick={() => onFocusStatus(status)}
                title={t("alerts.board.focusTip")}
              >
                {laneAlerts.length}
              </button>
            </header>
            <div className="flex flex-col gap-2.5 px-2.5 pb-3">
              {laneAlerts.length ? (
                laneAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    actionLoading={actionLoading && actionAlertId === alert.id}
                    onDone={onDone}
                    onCancel={onCancel}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <p className="m-0 py-8 text-center text-sm text-(--Grey600)">
                  {t("alerts.board.none")}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AlertBoard;
