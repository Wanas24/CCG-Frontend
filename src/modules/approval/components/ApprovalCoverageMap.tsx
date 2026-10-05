import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  ApprovalActionScope,
  type TApprovalActionScope,
  type TApprovalWorkflow,
} from "../types";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import ApprovalHintIcon from "./ApprovalHintIcon";

type Props = {
  studio: ApprovalStudioApi;
};

const SCOPES: TApprovalActionScope[] = [
  ApprovalActionScope.Create,
  ApprovalActionScope.Update,
  ApprovalActionScope.Delete,
];

const scopeColumnKey = (scope: TApprovalActionScope) => {
  switch (scope) {
    case ApprovalActionScope.Create:
      return "approval.scopes.create" as const;
    case ApprovalActionScope.Update:
      return "approval.scopes.update" as const;
    default:
      return "approval.scopes.delete" as const;
  }
};

const resolveCell = (
  workflows: TApprovalWorkflow[],
  entityType: string,
  scope: TApprovalActionScope,
) => {
  const active = workflows.filter(
    (workflow) => workflow.entityType === entityType && workflow.isActive,
  );
  const exact = active.find((workflow) => workflow.actionScope === scope);
  if (exact) return { kind: "exact" as const, workflow: exact };
  const fallback = active.find(
    (workflow) => workflow.actionScope === ApprovalActionScope.All,
  );
  if (fallback) return { kind: "fallback" as const, workflow: fallback };
  return { kind: "none" as const, workflow: null };
};

const ApprovalCoverageMap = ({ studio }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-(--Grey300) bg-(--app-surface) shadow-[0_18px_40px_-22px_var(--Grey500)]">
      <div className="flex flex-wrap items-center gap-2 px-[18px] pt-4 pb-3">
        <h2 className="m-0 text-[15px] font-bold text-(--app-text)">
          {t("approval.coverage.title")}
        </h2>
        <ApprovalHintIcon hintKey="coverageFallback" />
        <span className="text-xs text-(--Grey500)">{t("approval.coverage.hint")}</span>
      </div>
      <div className="overflow-auto px-[18px] pb-[18px]">
        <table className="w-full min-w-full border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th className="text-start text-xs font-semibold whitespace-nowrap text-(--Grey600)">
                {t("approval.entities.title")}
              </th>
              {SCOPES.map((scope) => (
                <th
                  key={scope}
                  className="text-center text-xs font-semibold text-(--Grey600)"
                >
                  {t(scopeColumnKey(scope))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studio.entityTypes.map((entity) => (
              <tr key={entity.key}>
                <td className="text-start text-sm font-semibold whitespace-nowrap text-(--app-text)">
                  {entity.value}
                </td>
                {SCOPES.map((scope) => {
                  const cell = resolveCell(
                    studio.workflows,
                    entity.key,
                    scope,
                  );
                  const canOpen = studio.canCreate || studio.canUpdate;
                  return (
                    <td key={scope}>
                      <button
                        type="button"
                        disabled={!canOpen}
                        className={clsx(
                          "grid h-[56px] w-full min-w-[120px] place-items-center rounded-[10px] border px-2 text-center text-xs font-semibold transition-colors",
                          cell.kind === "exact" &&
                            "border-(--statusG200) bg-(--statusG100) text-(--statusG200)",
                          cell.kind === "fallback" &&
                            "border-(--statusB200) bg-(--statusB100) text-(--statusB200)",
                          cell.kind === "none" &&
                            "border-dashed border-(--Grey400) bg-(--Grey100) text-(--Grey600)",
                          canOpen
                            ? "cursor-pointer hover:border-(--Primary400)"
                            : "cursor-not-allowed opacity-70",
                        )}
                        onClick={() => {
                          if (cell.kind === "exact" && cell.workflow) {
                            studio.openEdit(cell.workflow.id);
                            return;
                          }
                          if (cell.kind === "fallback" && cell.workflow) {
                            studio.openEdit(cell.workflow.id);
                            return;
                          }
                          studio.openNew(entity.key, scope);
                        }}
                      >
                        {cell.kind === "exact" ? (
                          <span className="flex flex-col gap-0.5">
                            <span className="truncate">{cell.workflow?.name}</span>
                            <span className="text-[10px] font-normal opacity-80">
                              {t("approval.coverage.exact")}
                            </span>
                          </span>
                        ) : null}
                        {cell.kind === "fallback" ? (
                          <span className="flex flex-col gap-0.5">
                            <span className="truncate">{cell.workflow?.name}</span>
                            <span className="text-[10px] font-normal opacity-80">
                              {t("approval.coverage.fallback")}
                            </span>
                          </span>
                        ) : null}
                        {cell.kind === "none" ? (
                          <span className="flex flex-col gap-0.5">
                            <span>{t("approval.coverage.none")}</span>
                            <span className="text-[10px] font-normal opacity-80">
                              {t("approval.coverage.noneSub")}
                            </span>
                          </span>
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ApprovalCoverageMap;
