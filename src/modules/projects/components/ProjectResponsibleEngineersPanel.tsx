import { useTranslation } from "react-i18next";
import type { UIEvent } from "react";
import { Users } from "lucide-react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppDropDownSelect,
  AppInput,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import AppEmptyState from "@/shared/ANTD_UIComponents/AppEmptyView/AppEmptyState";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import {
  ENGINEER_POSITION_OPTIONS,
  EngineerApprovalDecision,
} from "../constants/engineerPositions";
import { useProjectResponsibleEngineersManager } from "../hooks/useProjectResponsibleEngineersManager";
import type { TProject } from "../types/project";
import { engineerPositionLabelKey } from "../utils/engineerPositionLabels";
import ProjectEngineerDeleteDialog from "./ProjectEngineerDeleteDialog";

type Props = {
  project: TProject;
};

const nearListBottom = (event: UIEvent<HTMLDivElement>) => {
  const target = event.currentTarget;
  return target.scrollTop + target.clientHeight >= target.scrollHeight - 32;
};

const ProjectResponsibleEngineersPanel = ({ project }: Props) => {
  const { t } = useTranslation();
  const manager = useProjectResponsibleEngineersManager(project);

  if (!manager.canGetEngineers) {
    return (
      <AppEmptyState
        icon={<Users size={DesignTokens.media.iconMd} />}
        title={t("projects.workspace.sections.responsible-engineers")}
        description={t("projects.team.engineersNoAccess")}
      />
    );
  }

  const positionOptions = ENGINEER_POSITION_OPTIONS.map((value) => ({
    value,
    label: t(
      engineerPositionLabelKey(value) ?? "projects.team.positions.projectManager",
    ),
  }));

  const employeeOptions = [
    { value: "", label: t("projects.team.noLinkedEmployee") },
    ...manager.employees.map((employee) => ({
      value: employee.id,
      label: manager.personName(employee) || employee.email || employee.id,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-base font-semibold text-(--app-text)">
          {t("projects.workspace.sections.responsible-engineers")}
        </h2>
        <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
          {t("projects.team.engineersSubtitle")}
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 sm:p-4">
        {manager.showForm ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {manager.canGetEmployees ? (
                <AppDropDownSelect
                  label={t("projects.team.linkedEmployee")}
                  value={manager.engineerForm.employeeId || undefined}
                  options={employeeOptions}
                  showSearch
                  filterOption={false}
                  loading={manager.employeesQuery.isPending}
                  onSearch={manager.setEmployeeSearch}
                  onPopupScroll={(event) => {
                    if (
                      nearListBottom(event) &&
                      manager.employeesQuery.hasNextPage
                    ) {
                      void manager.employeesQuery.fetchNextPage();
                    }
                  }}
                  onChange={(value) =>
                    manager.selectEmployeeForEngineer(
                      typeof value === "string" ? value : "",
                    )
                  }
                />
              ) : null}
              <AppInput
                label={t("projects.team.engineerName")}
                required
                value={manager.engineerForm.employeeName}
                placeholder={t("projects.team.engineerNamePlaceholder")}
                onChange={(event) =>
                  manager.setEngineerForm((current) => ({
                    ...current,
                    employeeName: event.target.value,
                  }))
                }
              />
              <div className="sm:col-span-2">
                <AppDropDownSelect
                  label={t("projects.team.position")}
                  required
                  value={manager.engineerForm.position}
                  options={positionOptions}
                  showSearch
                  optionFilterProp="label"
                  onChange={(value) => {
                    if (typeof value === "number") {
                      manager.setEngineerForm((current) => ({
                        ...current,
                        position: value,
                      }));
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {manager.editingEngineer ? (
                manager.canEdit ? (
                  <AppButton
                    className="w-fit!"
                    loading={manager.isSavingEngineer}
                    onClick={() => {
                      void manager.submitEngineer();
                    }}
                  >
                    {t("projects.team.updateEngineer")}
                  </AppButton>
                ) : null
              ) : manager.canCreate ? (
                <AppButton
                  className="w-fit!"
                  loading={manager.isSavingEngineer}
                  onClick={() => {
                    void manager.submitEngineer();
                  }}
                >
                  {t("projects.team.addEngineer")}
                </AppButton>
              ) : null}
              {manager.editingEngineer ? (
                <AppButton
                  variant="secondary"
                  className="w-fit!"
                  disabled={manager.isSavingEngineer}
                  onClick={manager.resetEngineerForm}
                >
                  {t("projects.team.cancel")}
                </AppButton>
              ) : null}
            </div>
          </>
        ) : null}

        {manager.engineersQuery.isError ||
        (manager.engineersQuery.data &&
          !manager.engineersQuery.data.isSuccess) ? (
          <div className="flex flex-col gap-2">
            <AppErrorContainer
              error={
                manager.engineersQuery.data?.message ??
                t("projects.team.engineersLoadError")
              }
            />
            <AppButton
              variant="secondary"
              className="w-fit!"
              loading={manager.engineersQuery.isFetching}
              onClick={() => {
                void manager.engineersQuery.refetch();
              }}
            >
              {t("projects.retry")}
            </AppButton>
          </div>
        ) : manager.engineersQuery.isPending ? (
          <div className="flex flex-col gap-2">
            <AppSkeleton.Input active className="!h-14 !w-full !min-w-0" />
            <AppSkeleton.Input active className="!h-14 !w-full !min-w-0" />
          </div>
        ) : manager.engineers.length === 0 ? (
          <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
            {t("projects.team.engineersEmpty")}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {manager.engineers.map((engineer) => {
              const positionKey = engineerPositionLabelKey(
                Number(engineer.position),
              );
              return (
                <div
                  key={engineer.id}
                  className="flex flex-col gap-2 rounded-xl border border-(--Grey300) bg-(--app-surface) p-3 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p
                      className="m-0 truncate text-sm font-semibold text-(--app-text)"
                      dir="auto"
                    >
                      {engineer.employeeName}
                    </p>
                    <p
                      className={`m-0 truncate text-xs ${DesignTokens.typography.muted}`}
                    >
                      {positionKey ? t(positionKey) : t("projects.team.position")}
                      {engineer.approvalStatusName
                        ? ` · ${engineer.approvalStatusName}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {engineer.canApprove ? (
                      <>
                        <AppButton
                          className="w-fit!"
                          loading={
                            manager.isDeciding &&
                            manager.decidingId === engineer.id
                          }
                          disabled={manager.isDeciding}
                          onClick={() => {
                            void manager.decideEngineer(
                              engineer,
                              EngineerApprovalDecision.Approve,
                            );
                          }}
                        >
                          {t("projects.team.approve")}
                        </AppButton>
                        <AppButton
                          variant="delete"
                          className="w-fit!"
                          loading={
                            manager.isDeciding &&
                            manager.decidingId === engineer.id
                          }
                          disabled={manager.isDeciding}
                          onClick={() => {
                            void manager.decideEngineer(
                              engineer,
                              EngineerApprovalDecision.Decline,
                            );
                          }}
                        >
                          {t("projects.team.decline")}
                        </AppButton>
                      </>
                    ) : null}
                    {manager.canEdit ? (
                      <AppButton
                        variant="secondary"
                        className="w-fit!"
                        onClick={() => manager.startEditEngineer(engineer)}
                      >
                        {t("projects.team.edit")}
                      </AppButton>
                    ) : null}
                    {manager.canDelete ? (
                      <AppButton
                        variant="delete"
                        className="w-fit!"
                        onClick={() => manager.openDeleteEngineer(engineer)}
                      >
                        {t("projects.team.remove")}
                      </AppButton>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {manager.canDelete ? (
        <ProjectEngineerDeleteDialog
          engineer={manager.deletingEngineer}
          loading={manager.isDeletingEngineer}
          onConfirm={() => {
            void manager.confirmDeleteEngineer();
          }}
          onClose={manager.closeDeleteEngineer}
        />
      ) : null}
    </div>
  );
};

export default ProjectResponsibleEngineersPanel;
