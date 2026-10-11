import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { TAlert } from "../types";
import { getAlertUiStatus } from "../utils/alertStatus";
import { ALERT_STATUS_DOT_CLASS } from "../utils/alertStatusStyles";
import { formatAlertDayKey } from "../utils/formatAlertDateTime";
import AlertCard from "./AlertCard";

type Props = {
  alerts: TAlert[];
  actionAlertId?: number | null;
  actionLoading?: boolean;
  onDone: (alert: TAlert) => void;
  onCancel: (alert: TAlert) => void;
  onDelete: (alert: TAlert) => void;
};

type TimelineEntry =
  | { kind: "day"; key: string; label: string }
  | { kind: "alert"; key: string; alert: TAlert };

const AlertTimeline = ({
  alerts,
  actionAlertId,
  actionLoading,
  onDone,
  onCancel,
  onDelete,
}: Props) => {
  const { t, i18n } = useTranslation();

  const entries = useMemo(() => {
    const sorted = [...alerts].sort((left, right) => {
      const leftMs = new Date(left.triggerAt).getTime();
      const rightMs = new Date(right.triggerAt).getTime();
      return rightMs - leftMs;
    });

    const next: TimelineEntry[] = [];
    let lastDay = "";

    for (const alert of sorted) {
      const dayLabel =
        formatAlertDayKey(alert.triggerAt, i18n.language) ||
        t("alerts.board.unknownDay");
      if (dayLabel !== lastDay) {
        next.push({ kind: "day", key: `day-${dayLabel}`, label: dayLabel });
        lastDay = dayLabel;
      }
      next.push({ kind: "alert", key: `alert-${alert.id}`, alert });
    }

    return next;
  }, [alerts, i18n.language, t]);

  if (!entries.length) {
    return (
      <p className="m-0 py-8 text-center text-sm text-(--Grey600)">
        {t("alerts.board.none")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0 px-1 pt-1 pb-2">
      {entries.map((entry, index) => {
        if (entry.kind === "day") {
          return (
            <div
              key={entry.key}
              className="mb-2 ms-7 text-[11px] font-bold tracking-[0.08em] text-(--Grey600) uppercase"
            >
              {entry.label}
            </div>
          );
        }

        const status = getAlertUiStatus(entry.alert);
        const isLast =
          entries.slice(index + 1).find((item) => item.kind === "alert") ==
          null;

        return (
          <div
            key={entry.key}
            className="mb-3 grid grid-cols-[28px_minmax(0,1fr)] gap-3"
          >
            <div className="relative flex justify-center pt-4">
              <span
                className={clsx(
                  "absolute inset-x-1/2 top-0 w-0.5 -translate-x-1/2 bg-(--Grey300)",
                  isLast ? "bottom-3" : "-bottom-3",
                )}
                aria-hidden
              />
              <i
                className={clsx(
                  "relative z-[1] size-2.5 shrink-0 rounded-full",
                  ALERT_STATUS_DOT_CLASS[status],
                )}
                aria-hidden
              />
            </div>
            <AlertCard
              alert={entry.alert}
              actionLoading={
                actionLoading && actionAlertId === entry.alert.id
              }
              onDone={onDone}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AlertTimeline;
