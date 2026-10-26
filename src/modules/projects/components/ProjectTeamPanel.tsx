import { useTranslation } from "react-i18next";
import type { UIEvent } from "react";
import { DesignTokens } from "@/AntdTheme/DesignTokens";
import {
  AppButton,
  AppCheckBox,
  AppInput,
  AppSkeleton,
} from "@/shared/ANTD_UIComponents";
import AppErrorContainer from "@/shared/ANTD_UIComponents/AppErrorContainer/AppErrorContainer";
import { useProjectTeamManager } from "../hooks/useProjectTeamManager";
import type { TProject } from "../types/project";

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
                          <span
                            className="min-w-0 flex-1 truncate text-sm"
                            dir="auto"
                          >
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
  );
};

export default ProjectTeamPanel;
