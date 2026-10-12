import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { MyApprovalRequestsApi } from "../../hooks/useMyApprovalRequests";
import { buildApprovalRequestDiff } from "../../utils/buildApprovalRequestDiff";
import { formatApprovalDateTime } from "../../utils/formatApprovalDateTime";
import { resolveMyApprovalRequestNextApprovers } from "../../utils/resolveMyApprovalRequestNextApprovers";
import MyApprovalRequestBadges from "./MyApprovalRequestBadges";

type Props = {
  studio: MyApprovalRequestsApi;
};

const MyApprovalRequestList = ({ studio }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <section className="flex min-h-[20rem] flex-col rounded-2xl border border-(--Grey300) bg-(--app-surface)">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <h2 className={clsx(DesignTokens.typography.emphasis, "m-0 text-sm!")}>
          {t("approval.myRequests.listTitle")}
        </h2>
        <span
          className={clsx(
            "rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold",
            DesignTokens.typography.muted,
          )}
        >
          {studio.totalCount}
        </span>
      </div>

      <div className="flex max-h-[min(32rem,calc(100dvh-22rem))] flex-col gap-2.5 overflow-auto px-3 pb-3 lg:max-h-[calc(100dvh-22rem)]">
        {!studio.items.length ? (
          <p className={clsx("m-0 px-2 py-8 text-center", DesignTokens.typography.muted)}>
            {t("approval.myRequests.emptyList")}
          </p>
        ) : (
          studio.items.map((item) => {
            const changedCount = buildApprovalRequestDiff(item).filter(
              (row) => row.kind !== "same",
            ).length;
            const next = resolveMyApprovalRequestNextApprovers(item);
            const nextNames = next.ids
              .map((id) => studio.resolvePersonName(id))
              .filter(Boolean);
            const selected = item.requestId === studio.selectedId;

            return (
              <button
                key={item.requestId}
                type="button"
                onClick={() => studio.setSelectedId(item.requestId)}
                className={clsx(
                  "rounded-xl border px-3.5 py-3 text-start transition-colors",
                  selected
                    ? "border-(--Primary400) bg-(--Primary100)"
                    : "border-(--Grey300) bg-(--Grey100) hover:border-(--Grey400)",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MyApprovalRequestBadges
                    actionType={item.actionType}
                    status={item.status}
                  />
                  <span
                    className={clsx(
                      DesignTokens.typography.emphasis,
                      "min-w-0 flex-1 truncate text-sm!",
                    )}
                  >
                    {item.entityType} #{item.entityId}
                  </span>
                </div>
                <div
                  className={clsx(
                    "mt-1.5 flex flex-wrap gap-2 text-xs",
                    DesignTokens.typography.muted,
                  )}
                >
                  <span>
                    {studio.resolvePersonName(item.requestedByUserId) ??
                      item.requestedByUserId}
                  </span>
                  <span>
                    {formatApprovalDateTime(item.requestedAtUtc, locale)}
                  </span>
                  <span className="ms-auto font-bold text-(--Primary400)">
                    {t("approval.myRequests.fieldsChanged", {
                      count: changedCount,
                    })}
                  </span>
                </div>
                {nextNames.length ? (
                  <p className="m-0 mt-2 text-xs text-(--app-text)">
                    {t("approval.myRequests.nextApproversPrefix")}{" "}
                    <b>{nextNames.join(", ")}</b>
                    {next.levelName
                      ? ` · ${next.levelName}`
                      : null}
                  </p>
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-(--Grey300) px-3.5 py-3">
        <span className={clsx("me-auto text-xs", DesignTokens.typography.muted)}>
          {studio.totalCount
            ? t("approval.myRequests.pageLabel", {
                page: studio.page,
                total: studio.totalPages,
              })
            : t("approval.myRequests.noMatches")}
        </span>
        <AppButton
          variant="secondary"
          disabled={studio.page <= 1 || studio.isFetching}
          onClick={() => studio.setPage(studio.page - 1)}
        >
          {t("approval.myRequests.previous")}
        </AppButton>
        <AppButton
          variant="secondary"
          disabled={
            studio.page >= studio.totalPages ||
            studio.totalCount === 0 ||
            studio.isFetching
          }
          onClick={() => studio.setPage(studio.page + 1)}
        >
          {t("approval.myRequests.next")}
        </AppButton>
      </div>
    </section>
  );
};

export default MyApprovalRequestList;
