import { ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { useLocale } from "@/i18n/useLocale";
import { APPROVAL_ROUTES } from "@/modules/approval/routes/paths";
import {
  ApprovalDecision,
  type TApprovalPendingRequest,
} from "@/modules/approval/types";
import { ACTION_TYPE_LABEL_KEYS } from "@/modules/approval/utils/approvalScopes";
import { formatApprovalDateTime } from "@/modules/approval/utils/formatApprovalDateTime";
import { myApprovalStatusLabelKey } from "@/modules/approval/utils/myApprovalRequestMaps";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import {
  AppButton,
  AppSkeleton,
  AppTag,
} from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useProjectApprovalsManager } from "../hooks/useProjectApprovalsManager";
import { projectWorkspacePath } from "../routes/paths";
import type { TProject } from "../types/project";
import ProjectApprovalDecideDialog from "./ProjectApprovalDecideDialog";

type Props = {
  project: TProject;
};

const actionLabelKey = (actionType: number) => {
  if (actionType >= 0 && actionType < ACTION_TYPE_LABEL_KEYS.length) {
    return ACTION_TYPE_LABEL_KEYS[actionType];
  }
  return null;
};

type RequestCardProps = {
  request: TApprovalPendingRequest;
  isActive: boolean;
  canDecide: boolean;
  deciding: boolean;
  onApprove: () => void;
  onDecline: () => void;
};

const ProjectApprovalRequestCard = ({
  request,
  isActive,
  canDecide,
  deciding,
  onApprove,
  onDecline,
}: RequestCardProps) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const statusKey = myApprovalStatusLabelKey(request.status);
  const actionKey = actionLabelKey(request.actionType);
  const levelName =
    request.levels?.find(
      (level) => level.levelOrder === request.currentFocusLevelOrder,
    )?.name ?? null;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-(--Grey300) bg-(--app-surface) p-3 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {isActive ? (
            <AppTag variant="inReview">{t("projects.approvals.activeTag")}</AppTag>
          ) : null}
          <AppTag variant="pending">
            {statusKey
              ? t(statusKey)
              : t("approval.requests.pendingStatus")}
          </AppTag>
          {actionKey ? <AppTag variant="inReview">{t(actionKey)}</AppTag> : null}
        </div>
        <p className={`m-0 mt-2 text-sm ${DesignTokens.typography.muted}`}>
          {t("approval.requests.entityId", { id: request.entityId })}
        </p>
        <dl className="m-0 mt-2 grid gap-1 text-xs text-(--Grey600)">
          <div className="flex flex-wrap gap-x-1">
            <dt className="m-0 font-medium text-(--Grey500)">
              {t("approval.requests.requestedAt")}:
            </dt>
            <dd className="m-0">
              {formatApprovalDateTime(request.requestedAtUtc, locale)}
            </dd>
          </div>
          {request.requestedByUserId ? (
            <div className="flex flex-wrap gap-x-1">
              <dt className="m-0 font-medium text-(--Grey500)">
                {t("approval.requests.requestedByLabel")}:
              </dt>
              <dd className="m-0 truncate">{request.requestedByUserId}</dd>
            </div>
          ) : null}
          {request.currentFocusLevelOrder != null ? (
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
          ) : null}
        </dl>
      </div>
      {canDecide ? (
        <div className="flex flex-wrap gap-2">
          <AppButton
            className="w-fit!"
            disabled={deciding}
            onClick={onApprove}
          >
            {t("projects.approvals.approve")}
          </AppButton>
          <AppButton
            variant="delete"
            className="w-fit!"
            disabled={deciding}
            onClick={onDecline}
          >
            {t("projects.approvals.decline")}
          </AppButton>
        </div>
      ) : null}
    </article>
  );
};

const ProjectApprovalsPanel = ({ project }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const manager = useProjectApprovalsManager(project);

  const canOpenApprovalStudio = hasPermission(
    PermissionsList.ApprovalWorkflow.Get,
  );

  const listError =
    manager.requestsQuery.isError ||
    (manager.requestsQuery.data != null &&
      !manager.requestsQuery.data.isSuccess);

  const hasActionable = manager.actionableRequests.length > 0;
  const hasHistory = manager.historyRequests.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-(--app-text)">
            {t("projects.workspace.sections.approvals")}
          </h2>
          <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
            {t("projects.approvals.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AppButton
            variant="secondary"
            className="w-fit!"
            loading={manager.requestsQuery.isFetching}
            onClick={() => {
              void manager.refreshProjectApprovals();
            }}
          >
            {t("projects.approvals.refresh")}
          </AppButton>
          <AppButton
            variant="secondary"
            className="w-fit!"
            onClick={() => {
              void navigate(APPROVAL_ROUTES.myRequests);
            }}
          >
            {t("projects.approvals.openMyRequests")}
          </AppButton>
          {canOpenApprovalStudio ? (
            <AppButton
              variant="secondary"
              className="w-fit!"
              onClick={() => {
                void navigate(APPROVAL_ROUTES.approval);
              }}
            >
              {t("projects.approvals.openApprovalStudio")}
            </AppButton>
          ) : null}
          <AppButton
            variant="secondary"
            className="w-fit!"
            onClick={() => {
              void navigate(projectWorkspacePath(project.id, "team"));
            }}
          >
            {t("projects.approvals.openTeamEngineers")}
          </AppButton>
        </div>
      </div>

      <section className="rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 sm:p-4">
        {!manager.canGetEntityRequests ? (
          <AppEmptyState
            icon={<ClipboardCheck size={DesignTokens.media.iconMd} />}
            title={t("projects.approvals.noAccessTitle")}
            description={t("projects.approvals.noAccessDescription")}
          />
        ) : manager.isEntityTypeMissing ? (
          <AppEmptyState
            icon={<ClipboardCheck size={DesignTokens.media.iconMd} />}
            title={t("projects.approvals.entityTypeMissingTitle")}
            description={t("projects.approvals.entityTypeMissingDescription")}
          />
        ) : listError ? (
          <div className="flex flex-col gap-3">
            <AppErrorContainer
              error={
                manager.requestsQuery.data?.message ??
                t("projects.approvals.loadError")
              }
            />
            <AppButton
              variant="secondary"
              className="w-fit!"
              loading={manager.requestsQuery.isFetching}
              onClick={() => {
                void manager.requestsQuery.refetch();
              }}
            >
              {t("projects.retry")}
            </AppButton>
          </div>
        ) : manager.requestsQuery.isPending ||
          (manager.canGetEntityTypes && manager.entityTypesQuery.isPending) ? (
          <div className="flex flex-col gap-2">
            <AppSkeleton.Input active className="!h-20 !w-full !min-w-0" />
            <AppSkeleton.Input active className="!h-20 !w-full !min-w-0" />
          </div>
        ) : !hasActionable && !hasHistory ? (
          <AppEmptyState
            icon={<ClipboardCheck size={DesignTokens.media.iconMd} />}
            title={t("projects.approvals.emptyTitle")}
            description={t("projects.approvals.emptyDescription")}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <p className={`m-0 text-xs ${DesignTokens.typography.muted}`}>
              {t("projects.approvals.listHint", {
                entityType: manager.resolvedEntityType ?? "Project",
                entityId: manager.entityId,
              })}
            </p>

            <div className="flex flex-col gap-2">
              <h3 className="m-0 text-sm font-semibold text-(--app-text)">
                {t("projects.approvals.actionableTitle")}
              </h3>
              {hasActionable ? (
                manager.actionableRequests.map((request) => (
                  <ProjectApprovalRequestCard
                    key={request.requestId}
                    request={request}
                    isActive={manager.activeRequestId === request.requestId}
                    canDecide={manager.canForceDecide}
                    deciding={manager.isDeciding}
                    onApprove={() =>
                      manager.openDecide(request, ApprovalDecision.Approve)
                    }
                    onDecline={() =>
                      manager.openDecide(request, ApprovalDecision.Decline)
                    }
                  />
                ))
              ) : (
                <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
                  {t("projects.approvals.actionableEmpty")}
                </p>
              )}
            </div>

            {hasHistory ? (
              <div className="flex flex-col gap-2">
                <h3 className="m-0 text-sm font-semibold text-(--app-text)">
                  {t("projects.approvals.historyTitle")}
                </h3>
                {manager.historyRequests.map((request) => (
                  <ProjectApprovalRequestCard
                    key={request.requestId}
                    request={request}
                    isActive={false}
                    canDecide={false}
                    deciding={false}
                    onApprove={() => undefined}
                    onDecline={() => undefined}
                  />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>

      <ProjectApprovalDecideDialog
        decideState={manager.decideState}
        comment={manager.comment}
        loading={manager.isDeciding}
        onCommentChange={manager.setComment}
        onConfirm={() => {
          void manager.confirmDecide();
        }}
        onClose={manager.closeDecide}
      />
    </div>
  );
};

export default ProjectApprovalsPanel;
