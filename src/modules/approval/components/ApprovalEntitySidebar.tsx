import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";

type Props = {
  studio: ApprovalStudioApi;
};

const ApprovalEntitySidebar = ({ studio }: Props) => {
  const { t } = useTranslation();

  const activeByEntity = (entityKey: string) =>
    studio.workflows.filter(
      (workflow) => workflow.entityType === entityKey && workflow.isActive,
    ).length;

  const pendingByEntity = (entityKey: string) => {
    if (!studio.pending) return 0;
    return studio.pending.filter((request) => request.entityType === entityKey)
      .length;
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-3 lg:w-64">
      <p className="m-0 px-1 text-xs font-semibold uppercase tracking-wide text-(--Grey600)">
        {t("approval.entities.title")}
      </p>
      <button
        type="button"
        className={clsx(
          "flex w-full cursor-pointer flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-start transition-colors",
          studio.entityKey === "all"
            ? "border-(--Primary400) bg-(--Primary100) text-(--app-text)"
            : "border-transparent bg-transparent text-(--Grey600) hover:bg-(--Grey100)",
        )}
        onClick={() => studio.setEntityKey("all")}
      >
        <span className="text-sm font-semibold">{t("approval.entities.all")}</span>
        <span className="text-xs text-(--Grey500)">
          {t("approval.entities.activeCount", {
            count: studio.workflows.filter((workflow) => workflow.isActive).length,
          })}
        </span>
      </button>
      {studio.entityTypes.map((entity) => {
        const activeCount = activeByEntity(entity.key);
        const pendingCount = pendingByEntity(entity.key);
        const selected = studio.entityKey === entity.key;
        return (
          <button
            key={entity.key}
            type="button"
            className={clsx(
              "flex w-full cursor-pointer flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-start transition-colors",
              selected
                ? "border-(--Primary400) bg-(--Primary100) text-(--app-text)"
                : "border-transparent bg-transparent text-(--Grey600) hover:bg-(--Grey100)",
            )}
            onClick={() => studio.setEntityKey(entity.key)}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="min-w-0 flex-1 truncate">{entity.value}</span>
              {pendingCount > 0 ? (
                <span
                  className="rounded-full bg-(--statusY100) px-1.5 py-0.5 text-[10px] font-bold text-(--statusY200)"
                  title={t("approval.entities.pendingTitle", {
                    count: pendingCount,
                  })}
                >
                  {pendingCount}
                </span>
              ) : null}
            </span>
            <span className="text-xs text-(--Grey500)">
              {activeCount > 0
                ? t("approval.entities.activeCount", { count: activeCount })
                : t("approval.entities.noApproval")}
            </span>
          </button>
        );
      })}
    </aside>
  );
};

export default ApprovalEntitySidebar;
