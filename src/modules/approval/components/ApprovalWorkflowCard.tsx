import clsx from "clsx";
import {
  Copy,
  Lock,
  Pencil,
  Power,
  PowerOff,
  Inbox,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import {
  ApprovalActionScope,
  ApprovalApproverType,
  type TApprovalWorkflow,
} from "../types";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import ApprovalHintIcon from "./ApprovalHintIcon";

type Props = {
  workflow: TApprovalWorkflow;
  studio: ApprovalStudioApi;
};

const scopeLabelKey = (scope: number) => {
  switch (scope) {
    case ApprovalActionScope.Create:
      return "approval.scopes.create" as const;
    case ApprovalActionScope.Update:
      return "approval.scopes.update" as const;
    case ApprovalActionScope.Delete:
      return "approval.scopes.delete" as const;
    default:
      return "approval.scopes.all" as const;
  }
};

const ApprovalWorkflowCard = ({ workflow, studio }: Props) => {
  const { t } = useTranslation();
  const pendingCount = studio.pendingByWorkflow.get(workflow.id)?.length ?? 0;
  const locked = studio.lockedWorkflowIds.has(workflow.id);
  const levels = [...workflow.levels].sort(
    (a, b) => a.levelOrder - b.levelOrder,
  );

  const approverLabel = (approverType: number, approverKey: string) => {
    if (approverType === ApprovalApproverType.Role) {
      return (
        studio.roles?.find((role) => role.id === approverKey)?.name ??
        approverKey
      );
    }
    const employee = studio.employees?.find((item) => item.id === approverKey);
    if (!employee) return approverKey;
    const name = `${employee.firstName} ${employee.lastName}`.trim();
    return name || employee.email || approverKey;
  };

  return (
    <article
      className={clsx(
        "flex flex-col gap-3 rounded-2xl border bg-(--app-surface) p-4 shadow-[0_12px_28px_-20px_var(--Grey500)]",
        workflow.isActive
          ? "border-(--Grey300)"
          : "border-(--Grey300) opacity-80",
      )}
    >
      <header className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="m-0 truncate text-[15px] font-bold text-(--app-text)">
            {workflow.name}
          </h3>
          <p className="m-0 mt-1 text-xs text-(--Grey500)">
            {studio.entityName(workflow.entityType)}
          </p>
        </div>
        <span
          className={clsx(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            workflow.actionScope === ApprovalActionScope.All
              ? "border-(--Secondary300) bg-(--Primary100) text-(--Secondary300)"
              : "border-(--statusB200) bg-(--statusB100) text-(--statusB200)",
          )}
        >
          {t(scopeLabelKey(workflow.actionScope))}
        </span>
        <span
          className={clsx(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            workflow.isActive
              ? "border-(--statusG200) bg-(--statusG100) text-(--statusG200)"
              : "border-(--Grey400) bg-(--Grey100) text-(--Grey600)",
          )}
        >
          {workflow.isActive
            ? t("approval.workflow.active")
            : t("approval.workflow.inactive")}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-2 text-xs text-(--Grey600)">
        <span>{t("approval.workflow.levels", { count: levels.length })}</span>
        {pendingCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-(--statusY100) px-2 py-0.5 font-semibold text-(--statusY200)">
            {t("approval.workflow.pending", { count: pendingCount })}
          </span>
        ) : null}
      </div>

      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {levels.map((level, index) => (
          <li
            key={level.id}
            className="rounded-xl border border-(--Grey300) bg-(--Grey100) px-3 py-2"
          >
            <p className="m-0 text-xs font-semibold text-(--app-text)">
              {t("approval.builder.levelLabel", { index: index + 1 })}
              {level.name ? ` · ${level.name}` : ""}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {level.groups.map((group) => (
                <span
                  key={group.id}
                  className="inline-flex items-center rounded-full border border-(--Grey400) bg-(--app-surface) px-2 py-0.5 text-[11px] text-(--Grey600)"
                >
                  {approverLabel(group.approverType, group.approverKey)}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {locked ? (
        <div className="flex items-start gap-2 rounded-xl border border-(--statusY200) bg-(--statusY100) px-3 py-2.5 text-[13px] text-(--statusY200)">
          <Lock size={16} className="mt-0.5 shrink-0" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="m-0 flex items-center gap-1.5 font-semibold">
              {t("approval.workflow.lockedBanner", { count: pendingCount })}
              <ApprovalHintIcon hintKey="lockedByPending" />
            </p>
            {studio.canGetPending ? (
              <AppButton
                variant="tertiary"
                className="mt-1 h-auto! px-0!"
                onClick={() => studio.openRequests(workflow.id)}
              >
                {t("approval.workflow.resolveRequests")}
              </AppButton>
            ) : null}
          </div>
        </div>
      ) : null}

      <footer className="flex flex-wrap gap-2 border-t border-(--Grey300) pt-3">
        {studio.canUpdate ? (
          <AppButton
            variant="secondary"
            icon={<Pencil size={14} />}
            onClick={() => studio.openEdit(workflow.id)}
            title={
              locked ? t("approval.workflow.lockedEdit") : t("approval.workflow.edit")
            }
          >
            {t("approval.workflow.edit")}
          </AppButton>
        ) : null}
        {studio.canCreate ? (
          <AppButton
            variant="secondary"
            icon={<Copy size={14} />}
            onClick={() => studio.openCopy(workflow.id)}
          >
            {t("approval.workflow.copy")}
          </AppButton>
        ) : null}
        {workflow.isActive && studio.canDeactivate ? (
          <AppButton
            variant="secondary"
            icon={<PowerOff size={14} />}
            loading={studio.isSaving}
            onClick={() => void studio.deactivate(workflow.id)}
          >
            {t("approval.workflow.deactivate")}
          </AppButton>
        ) : null}
        {!workflow.isActive && studio.canUpdate ? (
          <AppButton
            variant="secondary"
            icon={<Power size={14} />}
            loading={studio.isSaving}
            onClick={() => void studio.reactivate(workflow)}
          >
            {t("approval.workflow.reactivate")}
          </AppButton>
        ) : null}
        {studio.canGetPending && pendingCount > 0 ? (
          <AppButton
            variant="secondary"
            icon={<Inbox size={14} />}
            onClick={() => studio.openRequests(workflow.id)}
          >
            {t("approval.workflow.resolveRequests")}
          </AppButton>
        ) : null}
      </footer>
    </article>
  );
};

export default ApprovalWorkflowCard;
