import { Pagination } from "antd";
import { Download, FolderKanban, Search, SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppDropDownSelect,
  AppInput,
} from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useGetProjects } from "../api/hooks/useGetProjects";
import {
  PROJECT_APPROVAL_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  type TProjectQuickFilter,
} from "../constants/projectList";
import { useExportProjectsManager } from "../hooks/useExportProjectsManager";
import { useProjectsListState } from "../hooks/useProjectsListState";
import {
  projectApprovalLabelKey,
  projectStatusLabelKey,
  projectTypeLabelKey,
} from "../utils/projectLabels";
import ClientSelect from "./ClientSelect";
import ProjectCard from "./ProjectCard";
import ProjectExportDialog from "./ProjectExportDialog";
import ProjectsListSkeleton from "./ProjectsListSkeleton";

const quickFilters: TProjectQuickFilter[] = [
  "all",
  "active",
  "pending",
  "draft",
];

const chipClass = (active: boolean) =>
  active
    ? "rounded-full border-0 bg-linear-to-r from-(--Primary300) to-(--Secondary300) px-3 py-1.5 text-xs font-semibold text-white"
    : "rounded-full border border-(--Grey300) bg-(--app-surface) px-3 py-1.5 text-xs font-semibold text-(--Grey600)";

const ProjectsList = () => {
  const { t } = useTranslation();
  const listState = useProjectsListState();
  const exportManager = useExportProjectsManager(listState.params);
  const { data, isPending, isError, isFetching, refetch } = useGetProjects(
    listState.params,
  );

  const pageData = data?.isSuccess ? data.data : undefined;
  const rows = pageData?.data ?? [];
  const totalCount = pageData?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / listState.pageSize));

  const statusOptions = PROJECT_STATUS_OPTIONS.map((value) => ({
    value,
    label: t(projectStatusLabelKey(value) ?? "projects.filters.anyStatus"),
  }));
  const approvalOptions = PROJECT_APPROVAL_OPTIONS.map((value) => ({
    value,
    label: t(projectApprovalLabelKey(value) ?? "projects.filters.anyApproval"),
  }));
  const typeOptions = PROJECT_TYPE_OPTIONS.map((value) => ({
    value,
    label: t(projectTypeLabelKey(value) ?? "projects.filters.anyType"),
  }));

  const showFilteredEmpty =
    !isPending &&
    !isError &&
    !(data && !data.isSuccess) &&
    rows.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((id) => (
          <button
            key={id}
            type="button"
            className={chipClass(listState.quick === id)}
            onClick={() => listState.applyQuickFilter(id)}
          >
            {t(`projects.quick.${id}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AppInput
            label={t("projects.filters.search")}
            value={listState.draft.search}
            onChange={(event) =>
              listState.setDraft((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            onPressEnter={listState.applyFilters}
            placeholder={t("projects.searchPlaceholder")}
            prefix={<Search size={16} className="text-(--Grey500)" />}
            allowClear
            aria-label={t("projects.searchPlaceholder")}
          />
          <AppDropDownSelect
            label={t("projects.filters.status")}
            value={listState.draft.status === "" ? undefined : listState.draft.status}
            allowClear
            placeholder={t("projects.filters.anyStatus")}
            options={statusOptions}
            onChange={(value) =>
              listState.setDraft((current) => ({
                ...current,
                status: typeof value === "number" ? value : "",
              }))
            }
          />
          <AppDropDownSelect
            label={t("projects.filters.approval")}
            value={
              listState.draft.approvalStatus === ""
                ? undefined
                : listState.draft.approvalStatus
            }
            allowClear
            placeholder={t("projects.filters.anyApproval")}
            options={approvalOptions}
            onChange={(value) =>
              listState.setDraft((current) => ({
                ...current,
                approvalStatus: typeof value === "number" ? value : "",
              }))
            }
          />
          <AppDropDownSelect
            label={t("projects.filters.type")}
            value={
              listState.draft.projectType === ""
                ? undefined
                : listState.draft.projectType
            }
            allowClear
            placeholder={t("projects.filters.anyType")}
            options={typeOptions}
            onChange={(value) =>
              listState.setDraft((current) => ({
                ...current,
                projectType: typeof value === "number" ? value : "",
              }))
            }
          />
          <AppDropDownSelect
            label={t("projects.filters.active")}
            value={
              listState.draft.isActive === ""
                ? undefined
                : listState.draft.isActive
                  ? "true"
                  : "false"
            }
            allowClear
            placeholder={t("projects.filters.anyActive")}
            options={[
              { value: "true", label: t("projects.filters.activeOnly") },
              { value: "false", label: t("projects.filters.inactiveOnly") },
            ]}
            onChange={(value) =>
              listState.setDraft((current) => ({
                ...current,
                isActive:
                  value === "true" ? true : value === "false" ? false : "",
              }))
            }
          />
          <ClientSelect
            label={t("projects.filters.client")}
            value={
              listState.draft.clientId === ""
                ? undefined
                : listState.draft.clientId
            }
            allowClear
            placeholder={t("projects.filters.anyClient")}
            onChange={(clientId) =>
              listState.setDraft((current) => ({
                ...current,
                clientId: clientId ?? "",
              }))
            }
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <AppButton onClick={listState.applyFilters} className="w-fit!">
            {t("projects.apply")}
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={listState.clearFilters}
            className="w-fit!"
          >
            {t("projects.clear")}
          </AppButton>
          {exportManager.canExport ? (
            <AppButton
              variant="secondary"
              className="w-fit!"
              icon={<Download size={16} />}
              onClick={exportManager.openExport}
            >
              {t("projects.export.action")}
            </AppButton>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h2 className="m-0 text-sm font-semibold text-(--app-text)">
          {t("projects.title")}
        </h2>
        <span className="rounded-full border border-(--Grey300) bg-(--Grey100) px-2 py-0.5 text-[11px] font-bold text-(--Grey600)">
          {t("projects.matchCount", { count: totalCount })}
        </span>
      </div>

      {isError || (data && !data.isSuccess) ? (
        <div className="flex flex-col gap-3">
          <AppErrorContainer
            error={data?.message ?? t("projects.loadError")}
          />
          <AppButton
            variant="secondary"
            loading={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="w-fit!"
          >
            {t("projects.retry")}
          </AppButton>
        </div>
      ) : isPending ? (
        <ProjectsListSkeleton />
      ) : showFilteredEmpty ? (
        <AppEmptyState
          icon={
            listState.hasAppliedFilters ? (
              <SearchX size={DesignTokens.media.iconMd} />
            ) : (
              <FolderKanban size={DesignTokens.media.iconMd} />
            )
          }
          title={
            listState.hasAppliedFilters
              ? t("projects.emptySearchTitle")
              : t("projects.emptyTitle")
          }
          description={
            listState.hasAppliedFilters
              ? t("projects.emptySearchDescription")
              : t("projects.emptyDescription")
          }
        />
      ) : (
        <>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-busy={isFetching || undefined}
          >
            {rows.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {totalCount > listState.pageSize ? (
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className={`m-0 text-xs ${DesignTokens.typography.muted}`}>
                {t("projects.pageLabel", {
                  page: listState.page,
                  total: totalPages,
                })}
              </p>
              <Pagination
                current={listState.page}
                pageSize={listState.pageSize}
                total={totalCount}
                showSizeChanger={false}
                onChange={(nextPage) => listState.setPage(nextPage)}
              />
            </div>
          ) : null}
        </>
      )}

      {exportManager.canExport ? (
        <ProjectExportDialog
          open={exportManager.open}
          loading={exportManager.isExporting}
          layoutsLoading={exportManager.layoutsLoading}
          layoutsError={exportManager.layoutsError}
          lastUsedLoading={exportManager.lastUsedLoading}
          format={exportManager.format}
          layoutId={exportManager.layoutId}
          title={exportManager.title}
          columns={exportManager.columns}
          layouts={exportManager.layouts}
          lastUsedName={exportManager.lastUsedName}
          selectedLayout={exportManager.selectedLayout}
          onFormatChange={exportManager.setFormat}
          onLayoutChange={exportManager.setLayoutId}
          onTitleChange={exportManager.setTitle}
          onToggleColumn={exportManager.toggleColumn}
          onSelectAllColumns={exportManager.selectAllColumns}
          onSelectEssentialColumns={exportManager.selectEssentialColumns}
          onClearColumns={exportManager.clearColumns}
          onSubmit={() => {
            void exportManager.submitExport();
          }}
          onClose={exportManager.closeExport}
        />
      ) : null}
    </div>
  );
};

export default ProjectsList;
