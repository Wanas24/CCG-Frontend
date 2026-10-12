import { startTransition } from "react";
import clsx from "clsx";
import { GitBranch, LayoutGrid, Plus, RefreshCw } from "lucide-react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import { AppButton, AppInput, AppSkeleton } from "@/shared/ANTD_UIComponents";
import type { ApprovalStudioApi } from "../hooks/useApprovalStudio";
import ApprovalBuilderDrawer from "./ApprovalBuilderDrawer";
import ApprovalCoverageMap from "./ApprovalCoverageMap";
import ApprovalDecideDialog from "./ApprovalDecideDialog";
import ApprovalEntitySidebar from "./ApprovalEntitySidebar";
import ApprovalRequestsDrawer from "./ApprovalRequestsDrawer";
import ApprovalWorkflowCard from "./ApprovalWorkflowCard";

type Props = {
  studio: ApprovalStudioApi;
};

const viewTabClass = (active: boolean) =>
  clsx(
    "inline-flex cursor-pointer items-center gap-2 rounded-[9px] border-0 px-3.5 py-2 text-[13px] font-semibold",
    active
      ? "bg-(--Primary400) text-(--app-surface)"
      : "bg-transparent text-(--Grey600)",
  );

const ApprovalStudioView = ({ studio }: Props) => {
  const { t } = useTranslation();

  if (studio.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <AppSkeleton active paragraph={{ rows: 2 }} />
        <p className={DesignTokens.typography.muted}>{t("approval.loading")}</p>
      </div>
    );
  }

  if (studio.isError || !studio.canGet) {
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm text-(--statusR200)">
          {studio.canGet ? t("approval.loadFailed") : t("approval.noAccess")}
        </p>
        <AppButton
          variant="secondary"
          icon={<RefreshCw size={16} />}
          onClick={() => void studio.reload()}
        >
          {t("approval.reload")}
        </AppButton>
      </div>
    );
  }

  const emptyMessage =
    studio.query.trim()
      ? t("approval.workflow.emptySearch")
      : studio.entityKey !== "all"
        ? t("approval.workflow.emptyEntity", {
            entity: studio.entityName(studio.entityKey),
          })
        : t("approval.workflow.emptyAll");

  return (
    <div className="flex flex-col gap-[18px]">
      {studio.isSaving || studio.isDeciding ? (
        <div
          className="sticky top-0 z-[5] h-[3px] overflow-hidden bg-(--Grey200)"
          aria-hidden
        >
          <span className="block h-full w-[35%] animate-pulse bg-(--Primary400)" />
        </div>
      ) : null}

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={clsx(DesignTokens.typography.headingSm, "text-2xl!")}>
            {t("approval.title")}
          </h1>
          <p className={clsx("m-0 mt-1", DesignTokens.typography.muted)}>
            {t("approval.subtitle")}
          </p>
        </div>
        <AppButton
          variant="secondary"
          icon={<RefreshCw size={16} />}
          onClick={() => void studio.reload()}
        >
          {t("approval.reload")}
        </AppButton>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex gap-1 rounded-xl border border-(--Grey300) bg-(--app-surface) p-1">
          <button
            type="button"
            className={viewTabClass(studio.view === "workflows")}
            onClick={() =>
              startTransition(() => studio.setView("workflows"))
            }
          >
            <GitBranch size={16} aria-hidden />
            {t("approval.views.workflows")}
          </button>
          <button
            type="button"
            className={viewTabClass(studio.view === "coverage")}
            onClick={() =>
              startTransition(() => studio.setView("coverage"))
            }
          >
            <LayoutGrid size={16} aria-hidden />
            {t("approval.views.coverage")}
          </button>
        </div>

        <div className="min-w-[220px] flex-1">
          <AppInput
            allowClear
            placeholder={t("approval.searchPlaceholder")}
            value={studio.query}
            onChange={(event) => studio.setQuery(event.target.value)}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-(--Grey600)">
          <Switch
            checked={studio.showInactive}
            onChange={studio.setShowInactive}
          />
          {t("approval.showInactive")}
        </label>

        {studio.canCreate ? (
          <AppButton
            icon={<Plus size={16} />}
            onClick={() => studio.openNew()}
          >
            {t("approval.newWorkflow")}
          </AppButton>
        ) : null}
      </div>

      {studio.view === "coverage" ? (
        <ApprovalCoverageMap studio={studio} />
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <ApprovalEntitySidebar studio={studio} />
          <div className="min-w-0 flex-1">
            {studio.filteredWorkflows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-(--Grey400) bg-(--app-surface) px-4 py-10 text-center">
                <p className="m-0 text-sm text-(--Grey500)">{emptyMessage}</p>
                {studio.canCreate ? (
                  <AppButton
                    className="mt-4"
                    icon={<Plus size={16} />}
                    onClick={() =>
                      studio.openNew(
                        studio.entityKey !== "all"
                          ? studio.entityKey
                          : undefined,
                      )
                    }
                  >
                    {t("approval.workflow.createForEntity")}
                  </AppButton>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {studio.filteredWorkflows.map((workflow) => (
                  <ApprovalWorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    studio={studio}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ApprovalBuilderDrawer studio={studio} />
      <ApprovalRequestsDrawer studio={studio} />
      <ApprovalDecideDialog studio={studio} />
    </div>
  );
};

export default ApprovalStudioView;
