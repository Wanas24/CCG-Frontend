import { useTranslation } from "react-i18next";
import clsx from "clsx";
import type { TAlertUiStatus } from "../types";
import { ALERT_STATUS_BADGE_CLASS } from "../utils/alertStatusStyles";

type Props = {
  status: TAlertUiStatus;
  relativeLabel?: string;
};

const AlertStatusBadge = ({ status, relativeLabel }: Props) => {
  const { t } = useTranslation();

  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-1 rounded-full border bg-(--app-surface) px-2 py-0.5 text-[10px] font-bold tracking-wide",
        ALERT_STATUS_BADGE_CLASS[status],
      )}
    >
      <span className="truncate">{t(`alerts.status.${status}`)}</span>
      {relativeLabel ? (
        <span className="truncate">· {relativeLabel}</span>
      ) : null}
    </span>
  );
};

export default AlertStatusBadge;
