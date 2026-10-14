import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Switch } from "antd";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { AppButton } from "@/shared/ANTD_UIComponents";
import type { MyApprovalRequestsApi } from "../../hooks/useMyApprovalRequests";
import {
  MyApprovalRequestAction,
  MyApprovalRequestLevelStatus,
} from "../../types/myApprovalRequest";
import {
  buildApprovalRequestDiff,
  formatApprovalDiffDisplayValue,
} from "../../utils/buildApprovalRequestDiff";
import { formatApprovalDateTime } from "../../utils/formatApprovalDateTime";
import {
  humanizeApprovalFieldKey,
  myApprovalDecisionLabelKey,
  myApprovalLevelStatusLabelKey,
  resolveMyApprovalActionCode,
  resolveMyApprovalLevelStatusCode,
} from "../../utils/myApprovalRequestMaps";
import { resolveMyApprovalRequestNextApprovers } from "../../utils/resolveMyApprovalRequestNextApprovers";
import MyApprovalRequestBadges from "./MyApprovalRequestBadges";

type Props = {
  studio: MyApprovalRequestsApi;
};

const MyApprovalRequestDetail = ({ studio }: Props) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const item = studio.selectedRequest;

  if (!item) {
    return (
      <section className="min-h-[20rem] rounded-2xl border border-(--Grey300) bg-(--app-surface) p-5">
        <p className={clsx("m-0 py-10 text-center", DesignTokens.typography.muted)}>
          {t("approval.myRequests.emptyDetail")}
        </p>
      </section>
    );
  }

  const actionCode = resolveMyApprovalActionCode(item.actionType);
  const rows = buildApprovalRequestDiff(item);
  const changed = rows.filter((row) => row.kind !== "same");
  const visible = studio.showSame ? rows : changed;
  const levels = item.levels ?? [];
  const decisions = item.decisions ?? [];
  const next = resolveMyApprovalRequestNextApprovers(item);
  const nextNames = next.ids
    .map((id) => studio.resolvePersonName(id))
    .filter(Boolean) as string[];

  const storyKey =
    actionCode === MyApprovalRequestAction.Create
      ? "approval.myRequests.story.create"
      : actionCode === MyApprovalRequestAction.Delete
        ? "approval.myRequests.story.delete"
        : "approval.myRequests.story.update";

  const renderValue = (key: string, value: unknown) => {
    const formatted = formatApprovalDiffDisplayValue(value);
    if (formatted.empty) {
      return (
        <span className={DesignTokens.typography.muted}>
          {t("approval.myRequests.emptyValue")}
        </span>
      );
    }
    if (formatted.booleanValue !== undefined) {
      return formatted.booleanValue
        ? t("approval.myRequests.boolean.yes")
        : t("approval.myRequests.boolean.no");
    }
    if (/approvalstatus/i.test(key)) {
      if (
        value === 1 ||
        value === "1" ||
        String(value).toLowerCase() === "pending"
      ) {
        return t("approval.myRequests.entityApprovalStatus.pending");
      }
      if (
        value === 2 ||
        value === "2" ||
        String(value).toLowerCase() === "approved"
      ) {
        return t("approval.myRequests.entityApprovalStatus.approved");
      }
    }
    return formatted.text;
  };

  return (
    <section className="min-h-[20rem] rounded-2xl border border-(--Grey300) bg-(--app-surface) p-5">
      <div className="mb-3.5 flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className={clsx(DesignTokens.typography.headingSm, "m-0 text-xl!")}>
            {item.entityType} #{item.entityId}
          </h2>
          <p className={clsx("m-0 mt-1 text-sm", DesignTokens.typography.muted)}>
            {studio.resolvePersonName(item.requestedByUserId) ??
              item.requestedByUserId}
            {" · "}
            {formatApprovalDateTime(item.requestedAtUtc, locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MyApprovalRequestBadges
            actionType={item.actionType}
            status={item.status}
          />
          {studio.canCancelSelected ? (
            <AppButton
              danger
              disabled={studio.isCancelling}
              onClick={studio.requestCancel}
            >
              {t("approval.myRequests.cancel.action")}
            </AppButton>
          ) : null}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-xs text-(--Grey600)">
          {t("approval.myRequests.meta.request")}{" "}
          <b className="font-semibold text-(--app-text)">
            {String(item.requestId).slice(0, 8)}
          </b>
        </span>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-xs text-(--Grey600)">
          {t("approval.myRequests.meta.completed")}{" "}
          <b className="font-semibold text-(--app-text)">
            {formatApprovalDateTime(item.completedAtUtc, locale)}
          </b>
        </span>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-xs text-(--Grey600)">
          {t("approval.myRequests.meta.changed")}{" "}
          <b className="font-semibold text-(--app-text)">{changed.length}</b>
        </span>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2.5 py-1.5 text-xs text-(--Grey600)">
          {t("approval.myRequests.meta.unchanged")}{" "}
          <b className="font-semibold text-(--app-text)">
            {rows.length - changed.length}
          </b>
        </span>
      </div>

      {levels.length ? (
        <div className="mb-4 flex gap-2 overflow-auto pb-1">
          {levels.map((level) => {
            const levelStatusCode = resolveMyApprovalLevelStatusCode(
              level.status,
            );
            const levelStatusKey = myApprovalLevelStatusLabelKey(level.status);
            const isCurrent =
              level.levelOrder === item.currentFocusLevelOrder;
            const isDone =
              levelStatusCode === MyApprovalRequestLevelStatus.Completed;
            const waitingHere = isCurrent ? nextNames : [];

            return (
              <div
                key={`${level.levelOrder}-${level.name ?? ""}`}
                className={clsx(
                  "min-w-[8.75rem] rounded-xl border bg-(--Grey100) px-3 py-2.5",
                  isCurrent
                    ? "border-(--statusY200)"
                    : isDone
                      ? "border-(--statusG200)"
                      : "border-(--Grey300)",
                )}
              >
                <small className={DesignTokens.typography.muted}>
                  {t("approval.myRequests.levelOrder", {
                    order: level.levelOrder,
                  })}
                </small>
                <b className="block text-sm">
                  {level.name || t("approval.myRequests.levelFallback")}
                </b>
                <small className={DesignTokens.typography.muted}>
                  {levelStatusKey ? t(levelStatusKey) : String(level.status)}
                </small>
                {waitingHere.length ? (
                  <span className="mt-1 block text-xs font-semibold text-(--app-text)">
                    {waitingHere.join(", ")}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {nextNames.length ? (
        <p className="mb-3.5 rounded-xl border border-(--statusY200) bg-(--statusY100) px-3 py-2.5 text-sm text-(--statusY200)">
          {t("approval.myRequests.waitingForPrefix")}{" "}
          <b>{nextNames.join(", ")}</b>
          {next.levelName
            ? ` ${t("approval.myRequests.waitingAt", { level: next.levelName })}`
            : null}
        </p>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-(--Grey300) bg-(--Primary100) px-3 py-2.5">
        <p className={clsx("m-0 flex-1 text-sm", DesignTokens.typography.muted)}>
          {t(storyKey)}
        </p>
        <label className="inline-flex items-center gap-2 text-xs text-(--Grey600)">
          <Switch
            size="small"
            checked={studio.showSame}
            onChange={(checked) => studio.setShowSame(checked)}
          />
          {t("approval.myRequests.showUnchanged")}
        </label>
      </div>

      {visible.length ? (
        <>
          <div className="mb-1 hidden grid-cols-[10rem_1fr_1.75rem_1fr] gap-2 text-[11px] font-bold uppercase tracking-wide text-(--Grey500) sm:grid">
            <span>{t("approval.myRequests.diff.field")}</span>
            <span className="text-(--statusR200)">
              {t("approval.myRequests.diff.before")}
            </span>
            <span />
            <span className="text-(--statusG200)">
              {t("approval.myRequests.diff.after")}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {visible.map((row) => (
              <div
                key={row.key}
                className={clsx(
                  "grid grid-cols-1 gap-2 sm:grid-cols-[10rem_1fr_1.75rem_1fr] sm:items-stretch",
                  row.kind === "same" && "opacity-55",
                )}
              >
                <div
                  className={clsx(
                    "flex items-center text-xs font-bold",
                    DesignTokens.typography.muted,
                  )}
                >
                  {humanizeApprovalFieldKey(row.key)}
                </div>
                <div
                  className={clsx(
                    "min-h-9 break-words rounded-[10px] border px-2.5 py-2 font-mono text-xs",
                    row.kind === "changed" || row.kind === "removed"
                      ? "border-(--statusR200) bg-(--statusR100) line-through decoration-(--statusR200)"
                      : "border-(--Grey300) bg-(--Grey100)",
                  )}
                >
                  {renderValue(row.key, row.before)}
                </div>
                <div className="hidden place-items-center text-(--Grey500) sm:grid">
                  →
                </div>
                <div
                  className={clsx(
                    "min-h-9 break-words rounded-[10px] border px-2.5 py-2 font-mono text-xs",
                    row.kind === "changed" || row.kind === "added"
                      ? "border-(--statusG200) bg-(--statusG100)"
                      : "border-(--Grey300) bg-(--Grey100)",
                  )}
                >
                  {renderValue(row.key, row.after)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className={clsx("m-0 py-6 text-center", DesignTokens.typography.muted)}>
          {t("approval.myRequests.diff.empty")}
        </p>
      )}

      {decisions.length ? (
        <div className="mt-5 flex flex-col gap-2">
          {decisions.map((decision, index) => {
            const decisionKey = myApprovalDecisionLabelKey(decision.decision);
            return (
              <div
                key={`${decision.actorUserId ?? "actor"}-${decision.decidedAtUtc ?? index}`}
                className="flex items-start gap-2.5 text-sm"
              >
                <i className="mt-1.5 size-2 shrink-0 rounded-full bg-(--Primary400)" />
                <div>
                  <b>
                    {decisionKey
                      ? t(decisionKey)
                      : String(decision.decision)}
                  </b>{" "}
                  {t("approval.myRequests.timeline.by")}{" "}
                  {studio.resolvePersonName(decision.actorUserId) ??
                    decision.actorUserId ??
                    t("approval.myRequests.emptyValue")}
                  <small className={clsx("block", DesignTokens.typography.muted)}>
                    {formatApprovalDateTime(decision.decidedAtUtc, locale)}
                    {decision.comment
                      ? ` · ${decision.comment}`
                      : ""}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
};

export default MyApprovalRequestDetail;
