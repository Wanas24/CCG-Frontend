import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Check } from "lucide-react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import type { TAlert } from "../types";
import { formatAlertAudienceSummary } from "../utils/alertAudience";
import {
  formatAlertDateTime,
  formatAlertRelativeTime,
} from "../utils/formatAlertDateTime";
import { getAlertUiStatus, isAlertOpen } from "../utils/alertStatus";
import { ALERT_STATUS_ACCENT_CLASS } from "../utils/alertStatusStyles";
import AlertStatusBadge from "./AlertStatusBadge";

type Props = {
  alert: TAlert;
  actionLoading?: boolean;
  onDone: (alert: TAlert) => void;
  onCancel: (alert: TAlert) => void;
  onDelete: (alert: TAlert) => void;
};

const AlertCard = ({
  alert,
  actionLoading,
  onDone,
  onCancel,
  onDelete,
}: Props) => {
  const { t, i18n } = useTranslation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const status = getAlertUiStatus(alert);
  const open = isAlertOpen(alert);
  const isMine = Boolean(
    currentUserId &&
      alert.createdById &&
      String(alert.createdById) === String(currentUserId),
  );

  const relativeLabel = formatAlertRelativeTime(alert.triggerAt, {
    justNow: t("alerts.relative.justNow"),
    inMinutes: (count) => t("alerts.relative.inMinutes", { count }),
    minutesAgo: (count) => t("alerts.relative.minutesAgo", { count }),
    inHours: (count) => t("alerts.relative.inHours", { count }),
    hoursAgo: (count) => t("alerts.relative.hoursAgo", { count }),
    inDays: (count) => t("alerts.relative.inDays", { count }),
    daysAgo: (count) => t("alerts.relative.daysAgo", { count }),
  });

  const audience = formatAlertAudienceSummary(alert, {
    everyone: t("alerts.audience.everyone"),
    noPeople: t("alerts.audience.noPeople"),
  });

  return (
    <article
      className={clsx(
        "relative min-w-0 overflow-hidden rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3.5 text-start",
        "before:absolute before:inset-y-0 before:start-0 before:w-[3px] before:content-['']",
        "transition hover:-translate-y-0.5 hover:border-(--Grey400)",
        ALERT_STATUS_ACCENT_CLASS[status],
      )}
    >
      <h3
        className="m-0 text-sm font-semibold leading-snug text-(--app-text)"
        dir="auto"
      >
        {alert.message}
      </h3>

      <p className="mt-2 mb-0 text-xs text-(--Grey600)">
        <span className="font-bold text-(--app-text)">{relativeLabel}</span>
        {" · "}
        {formatAlertDateTime(alert.triggerAt, i18n.language)}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <AlertStatusBadge status={status} relativeLabel={relativeLabel} />
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[10px] font-bold text-(--Grey600)">
          {audience}
        </span>
        {isMine ? (
          <span className="rounded-full border border-(--statusB200)/40 bg-(--Grey100) px-2 py-0.5 text-[10px] font-bold text-(--statusB200)">
            {t("alerts.board.createdByYou")}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {open ? (
          <>
            <button
              type="button"
              disabled={actionLoading}
              className="inline-flex items-center gap-1 rounded-lg bg-(--statusG200) px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              onClick={() => onDone(alert)}
            >
              <Check size={14} aria-hidden />
              {t("alerts.actions.done")}
            </button>
            <button
              type="button"
              disabled={actionLoading}
              className="inline-flex items-center rounded-lg bg-(--statusY200) px-2.5 py-1.5 text-xs font-semibold text-(--Grey900) disabled:opacity-50"
              onClick={() => onCancel(alert)}
            >
              {t("alerts.actions.cancel")}
            </button>
          </>
        ) : null}
        <button
          type="button"
          disabled={actionLoading}
          className="inline-flex items-center rounded-lg bg-(--statusR200) px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          onClick={() => onDelete(alert)}
        >
          {t("alerts.actions.delete")}
        </button>
      </div>
    </article>
  );
};

export default AlertCard;
