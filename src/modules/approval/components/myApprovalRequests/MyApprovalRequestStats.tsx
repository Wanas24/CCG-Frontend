import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import type { MyApprovalRequestsApi } from "../../hooks/useMyApprovalRequests";
import {
  MyApprovalRequestStatus,
  type TMyApprovalRequestStatus,
} from "../../types/myApprovalRequest";

type Props = {
  studio: MyApprovalRequestsApi;
};

const STATS: {
  id: TMyApprovalRequestStatus | "";
  labelKey:
    | "approval.myRequests.stats.all"
    | "approval.myRequests.stats.pending"
    | "approval.myRequests.stats.approved"
    | "approval.myRequests.stats.rejected"
    | "approval.myRequests.stats.cancelled";
  countKey: keyof MyApprovalRequestsApi["counts"];
  accentClass: string;
}[] = [
  {
    id: "",
    labelKey: "approval.myRequests.stats.all",
    countKey: "all",
    accentClass: "border-(--Primary400)",
  },
  {
    id: MyApprovalRequestStatus.Pending,
    labelKey: "approval.myRequests.stats.pending",
    countKey: "pending",
    accentClass: "border-(--statusY200)",
  },
  {
    id: MyApprovalRequestStatus.Approved,
    labelKey: "approval.myRequests.stats.approved",
    countKey: "approved",
    accentClass: "border-(--statusG200)",
  },
  {
    id: MyApprovalRequestStatus.Rejected,
    labelKey: "approval.myRequests.stats.rejected",
    countKey: "rejected",
    accentClass: "border-(--statusR200)",
  },
  {
    id: MyApprovalRequestStatus.Cancelled,
    labelKey: "approval.myRequests.stats.cancelled",
    countKey: "cancelled",
    accentClass: "border-(--Grey400)",
  },
];

const MyApprovalRequestStats = ({ studio }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {STATS.map((stat) => {
        const active = studio.status === stat.id;
        return (
          <button
            key={stat.labelKey}
            type="button"
            onClick={() => studio.setStatusFilter(stat.id)}
            className={clsx(
              "rounded-2xl border bg-(--app-surface) px-4 py-3.5 text-start transition-colors",
              active
                ? clsx(stat.accentClass, "shadow-sm")
                : "border-(--Grey300) hover:border-(--Grey400)",
            )}
          >
            <small
              className={clsx(
                "font-bold uppercase tracking-wide",
                DesignTokens.typography.muted,
                "text-[11px]!",
              )}
            >
              {t(stat.labelKey)}
            </small>
            <b className="mt-1 block text-[1.75rem] font-extrabold tracking-tight">
              {studio.counts[stat.countKey]}
            </b>
          </button>
        );
      })}
    </div>
  );
};

export default MyApprovalRequestStats;
