import clsx from "clsx";
import { CheckCircle2, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import {
  AppButton,
  AppCheckBox,
  AppDrawer,
  AppTag,
} from "@/shared/ANTD_UIComponents";
import { ApprovalDecision, type TApprovalPendingRequest } from "../types";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import { ACTION_TYPE_LABEL_KEYS } from "../utils/approvalScopes";
import { formatApprovalDateTime } from "../utils/formatApprovalDateTime";
import ApprovalHintIcon from "./ApprovalHintIcon";

type Props = {
  studio: ApprovalStudioApi;
};

const actionLabelKey = (actionType: number) => {
  if (actionType >= 0 && actionType < ACTION_TYPE_LABEL_KEYS.length) {
    return ACTION_TYPE_LABEL_KEYS[actionType];
  }
  return null;
};

type RequestRowProps = {
  request: TApprovalPendingRequest;
  studio: ApprovalStudioApi;
  selected: boolean;
  selectable: boolean;
  onToggle: (checked: boolean) => void;
};

const ApprovalRequestRow = ({
  request,
  studio,
  selected,
  selectable,
  onToggle,
}: RequestRowProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const entityLabel = studio.entityName(request.entityType);
  const actionKey = actionLabelKey(request.actionType);
  const requester = studio.employees?.find(
    (employee) => employee.id === request.requestedByUserId,
  );
  const requesterName = requester
    ? `${requester.firstName} ${requester.lastName}`.trim() ||
      requester.email ||
      null
    : null;
  const levelName =
    request.levels.find(
      (level) => level.levelOrder === request.currentFocusLevelOrder,
    )?.name ?? null;

  return (
    <li>
      <div
        className={clsx(
          "flex items-start gap-3 rounded-xl border bg-(--app-surface) px-3.5 py-3 transition-colors",
          selected
            ? "border-(--Primary400) bg-(--Primary100)"
            : "border-(--Grey300) hover:border-(--Grey400)",
          selectable && "cursor-pointer",
        )}
        onClick={
          selectable
            ? () => onToggle(!selected)
            : undefined
        }
        onKeyDown={
          selectable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onToggle(!selected);
                }
              }
            : undefined
        }
        role={selectable ? "button" : undefined}
        tabIndex={selectable ? 0 : undefined}
      >
        {selectable ? (
          <div
            className="mt-0.5 shrink-0"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <AppCheckBox
              checked={selected}
              onChange={(event) => onToggle(event.target.checked)}
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={clsx("m-0 truncate", DesignTokens.typography.headingSm)}>
                {entityLabel}
              </p>
              <p className="m-0 mt-0.5 truncate text-xs text-(--Grey500)">
                {t("approval.requests.entityId", { id: request.entityId })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <AppTag variant="pending">{t("approval.requests.pendingStatus")}</AppTag>
              {actionKey ? (
                <AppTag variant="inReview">{t(actionKey)}</AppTag>
              ) : null}
            </div>
          </div>

          <dl className="m-0 mt-2.5 grid gap-1 text-xs text-(--Grey600)">
            <div className="flex flex-wrap gap-x-1">
              <dt className="sr-only">{t("approval.requests.requestedAt")}</dt>
              <dd className="m-0">
                {formatApprovalDateTime(request.requestedAtUtc, locale)}
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-1">
              <dt className="m-0 font-medium text-(--Grey500)">
                {t("approval.requests.levelLabel")}:
              </dt>
              <dd className="m-0">
                {t("approval.requests.level", {
                  order: request.currentFocusLevelOrder,
                })}
                {levelName ? ` · ${levelName}` : ""}
              </dd>
            </div>
            {requesterName ? (
              <div className="flex flex-wrap gap-x-1">
                <dt className="m-0 font-medium text-(--Grey500)">
                  {t("approval.requests.requestedByLabel")}:
                </dt>
                <dd className="m-0 truncate">{requesterName}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </li>
  );
};

const ApprovalRequestsDrawer = ({ studio }: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const open = Boolean(studio.requestsWorkflowId);
  const workflow = studio.workflows.find(
    (item) => item.id === studio.requestsWorkflowId,
  );
  const requests = studio.requestsForOpen;
  const canSelect = studio.canForceDecide;
  const allSelected =
    canSelect &&
    requests.length > 0 &&
    requests.every((request) =>
      studio.selectedRequestIds.has(request.requestId),
    );
  const selectedCount = studio.selectedRequestIds.size;
  const indeterminate =
    canSelect && selectedCount > 0 && selectedCount < requests.length;

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      studio.setSelectedRequestIds(new Set());
      return;
    }
    studio.setSelectedRequestIds(
      new Set(requests.map((request) => request.requestId)),
    );
  };

  const toggleOne = (requestId: string, checked: boolean) => {
    const next = new Set(studio.selectedRequestIds);
    if (checked) next.add(requestId);
    else next.delete(requestId);
    studio.setSelectedRequestIds(next);
  };

  return (
    <AppDrawer
      open={open}
      placement={isRtl ? "left" : "right"}
      width={560}
      title={
        <span className="inline-flex items-center gap-2">
          <Inbox size={DesignTokens.media.iconMd} aria-hidden />
          {t("approval.requests.title")}
        </span>
      }
      onClose={studio.closeRequests}
      footer={
        canSelect && requests.length > 0 ? (
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-xs text-(--Grey500)">
              {t("approval.requests.selected", { count: selectedCount })}
            </span>
            <div className="flex flex-wrap gap-2 sm:ms-auto">
              <AppButton
                variant="secondary"
                danger
                disabled={selectedCount === 0 || studio.isDeciding}
                onClick={() =>
                  studio.setDecideState({
                    decision: ApprovalDecision.Decline,
                    requestIds: [...studio.selectedRequestIds],
                  })
                }
              >
                {t("approval.requests.decline")}
              </AppButton>
              <AppButton
                disabled={selectedCount === 0 || studio.isDeciding}
                onClick={() =>
                  studio.setDecideState({
                    decision: ApprovalDecision.Approve,
                    requestIds: [...studio.selectedRequestIds],
                  })
                }
              >
                {t("approval.requests.approve")}
              </AppButton>
            </div>
          </div>
        ) : null
      }
    >
      <div className="mb-4">
        <p className={clsx("m-0", DesignTokens.typography.emphasis)}>
          {workflow?.name ?? t("approval.requests.title")}
        </p>
        <p className="m-0 mt-1 flex items-start gap-1.5 text-sm text-(--Grey600)">
          <span>{t("approval.requests.subtitleHint")}</span>
          <ApprovalHintIcon hintKey="forceDecide" />
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-(--Grey400) bg-(--app-surface) px-4 py-10 text-center">
          <CheckCircle2
            size={36}
            className="text-(--statusG200)"
            aria-hidden
          />
          <p className={clsx("m-0 mt-3", DesignTokens.typography.headingSm)}>
            {t("approval.requests.allClear")}
          </p>
          <p className="m-0 mt-1 max-w-sm text-sm text-(--Grey500)">
            {t("approval.requests.allClearSub")}
          </p>
          {workflow && studio.canUpdate ? (
            <AppButton
              className="mt-4"
              onClick={() => {
                studio.closeRequests();
                studio.openEdit(workflow.id);
              }}
            >
              {t("approval.requests.editWorkflow")}
            </AppButton>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2">
            {canSelect ? (
              <AppCheckBox
                checked={allSelected}
                indeterminate={indeterminate}
                onChange={(event) => toggleAll(event.target.checked)}
              >
                {t("approval.requests.selectAll")}
              </AppCheckBox>
            ) : (
              <span className="text-sm text-(--Grey600)">
                {t("approval.requests.listLabel")}
              </span>
            )}
            <AppTag variant="dataCount">
              {t("approval.requests.count", { count: requests.length })}
            </AppTag>
          </div>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {requests.map((request) => (
              <ApprovalRequestRow
                key={request.requestId}
                request={request}
                studio={studio}
                selected={studio.selectedRequestIds.has(request.requestId)}
                selectable={canSelect}
                onToggle={(checked) => toggleOne(request.requestId, checked)}
              />
            ))}
          </ul>
        </div>
      )}
    </AppDrawer>
  );
};

export default ApprovalRequestsDrawer;
