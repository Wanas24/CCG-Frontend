import { useTranslation } from "react-i18next";
import type { UIEvent } from "react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppCheckBox,
  AppDropDownSelect,
  AppInput,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import {
  ENGINEER_POSITION_OPTIONS,
  EngineerApprovalDecision,
} from "../constants/engineerPositions";
import { useProjectTeamManager } from "../hooks/useProjectTeamManager";
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

const ProjectTeamPanel = ({ project }: Props) => {
  const { t } = useTranslation();
  const manager = useProjectTeamManager(project);

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
          {t("projects.workspace.sections.team")}
        </h2>
        <p className={`m-0 mt-1 text-sm ${DesignTokens.typography.muted}`}>
          {t("projects.team.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 sm:p-4">
          <h3 className="m-0 text-sm font-semibold text-(--app-text)">
            {t("projects.team.engineersTitle")}
          </h3>

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
            <AppButton
              className="w-fit!"
              loading={manager.isSavingEngineer}
              onClick={() => {
                void manager.submitEngineer();
              }}
            >
              {manager.editingEngineer
                ? t("projects.team.updateEngineer")
                : t("projects.team.addEngineer")}
            </AppButton>
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
                      <AppButton
                        variant="secondary"
                        className="w-fit!"
                        onClick={() => manager.startEditEngineer(engineer)}
                      >
                        {t("projects.team.edit")}
                      </AppButton>
                      <AppButton
                        variant="delete"
                        className="w-fit!"
                        onClick={() => manager.openDeleteEngineer(engineer)}
                      >
                        {t("projects.team.remove")}
                      </AppButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-(--Grey300) bg-(--Grey100) p-3 sm:p-4">
          <h3 className="m-0 text-sm font-semibold text-(--app-text)">
            {t("projects.team.assignmentsTitle")}
          </h3>
          <p className={`m-0 text-xs ${DesignTokens.typography.muted}`}>
            {t("projects.team.assignmentsHint")}
          </p>

          {!manager.canGetAssignments ? (
            <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
              {t("projects.team.assignmentsNoAccess")}
            </p>
          ) : manager.assignedQuery.isError ? (
            <div className="flex flex-col gap-2">
              <AppErrorContainer error={t("projects.team.assignmentsLoadError")} />
              <AppButton
                variant="secondary"
                className="w-fit!"
                loading={manager.assignedQuery.isFetching}
                onClick={() => {
                  void manager.assignedQuery.refetch();
                }}
              >
                {t("projects.retry")}
              </AppButton>
            </div>
          ) : manager.assignedQuery.isPending ? (
            <div className="flex flex-col gap-2">
              <AppSkeleton.Input active className="!h-10 !w-full !min-w-0" />
              <AppSkeleton.Input active className="!h-10 !w-full !min-w-0" />
            </div>
          ) : (
            <>
              <div>
                <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wide text-(--Grey600)">
                  {t("projects.team.currentlyAssigned")}
                </p>
                {manager.assignedUsers.length === 0 ? (
                  <p className={`m-0 text-sm ${DesignTokens.typography.muted}`}>
                    {t("projects.team.assignmentsEmpty")}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {manager.assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-(--Grey300) bg-(--app-surface) px-3 py-2"
                      >
                        <span className="truncate text-sm" dir="auto">
                          {[user.firstName, user.lastName]
                            .filter(Boolean)
                            .join(" ") || user.id}
                        </span>
                        {manager.canSetAssignments ? (
                          <AppButton
                            variant="delete"
                            className="w-fit!"
                            loading={manager.togglingUserId === user.id}
                            disabled={Boolean(manager.togglingUserId)}
                            onClick={() => {
                              void manager.toggleUserAssignment(user, false);
                            }}
                          >
                            {t("projects.team.remove")}
                          </AppButton>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {manager.canGetEmployees && manager.canSetAssignments ? (
                <div>
                  <AppInput
                    label={t("projects.team.findPerson")}
                    value={manager.employeeSearch}
                    placeholder={t("projects.team.findPersonPlaceholder")}
                    onChange={(event) =>
                      manager.setEmployeeSearch(event.target.value)
                    }
                  />
                  <div
                    className="mt-2 max-h-80 overflow-auto rounded-xl border border-(--Grey300) bg-(--app-surface) p-2"
                    onScroll={(event) => {
                      if (
                        nearListBottom(event) &&
                        manager.employeesQuery.hasNextPage
                      ) {
                        void manager.employeesQuery.fetchNextPage();
                      }
                    }}
                  >
                    {manager.employees.length === 0 ? (
                      <p
                        className={`m-0 p-2 text-sm ${DesignTokens.typography.muted}`}
                      >
                        {t("projects.team.peopleEmpty")}
                      </p>
                    ) : (
                      manager.employees.map((employee) => {
                        const checked = manager.assignedIds.has(employee.id);
                        return (
                          <label
                            key={employee.id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-(--Grey100)"
                          >
                            <AppCheckBox
                              className="w-auto! shrink-0"
                              checked={checked}
                              disabled={Boolean(manager.togglingUserId)}
                              onChange={(event) => {
                                void manager.toggleUserAssignment(
                                  employee,
                                  event.target.checked,
                                );
                              }}
                            />
                            <span className="min-w-0 flex-1 truncate text-sm" dir="auto">
                              {manager.personName(employee) ||
                                employee.email ||
                                employee.id}
                              {employee.isManager
                                ? ` · ${t("projects.team.manager")}`
                                : ""}
                            </span>
                          </label>
                        );
                      })
                    )}
                    {manager.employeesQuery.isFetchingNextPage ? (
                      <p
                        className={`m-0 p-2 text-xs ${DesignTokens.typography.muted}`}
                      >
                        {t("projects.team.loadingMore")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>

      <ProjectEngineerDeleteDialog
        engineer={manager.deletingEngineer}
        loading={manager.isDeletingEngineer}
        onConfirm={() => {
          void manager.confirmDeleteEngineer();
        }}
        onClose={manager.closeDeleteEngineer}
      />
    </div>
  );
};

export default ProjectTeamPanel;
