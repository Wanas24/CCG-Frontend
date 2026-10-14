import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetEmployees } from "@/modules/userControl/api/hooks/useGetEmployees";
import { readAllPages } from "@/modules/userControl/api/hooks/userControlPaging";
import { projectEmployeeService } from "@/modules/userControl/api/services/projectEmployee.service";
import type { TEmployee, TProjectUser } from "@/modules/userControl/types";
import { useGetProjectAssignedUsers } from "../api/hooks/useGetProjectAssignedUsers";
import { invalidateProjectAssignedUsers } from "../api/queryKeys/projectTeamQueryKeys";
import type { TProject } from "../types/project";

const EMPLOYEE_PAGE_SIZE = 10;

export const useProjectTeamManager = (project: TProject) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGetAssignments = hasPermission(
    PermissionsList.ProjectEmployee.GetActiveProjects,
  );
  const canSetAssignments = hasPermission(
    PermissionsList.ProjectEmployee.SetProjects,
  );
  const canGetEmployees = hasPermission(PermissionsList.Employee.Get);

  const searchHint = project.number?.trim() || project.name?.trim() || "";

  const assignedQuery = useGetProjectAssignedUsers(
    project.id,
    searchHint,
    canGetAssignments,
  );

  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [debouncedEmployeeSearch] = useDebounce(employeeSearch.trim(), 300);
  const employeesQuery = useGetEmployees(
    {
      pageSize: EMPLOYEE_PAGE_SIZE,
      search: debouncedEmployeeSearch || undefined,
      isFired: false,
    },
    canGetEmployees && canSetAssignments,
  );

  const assignedUsers = useMemo(
    () => assignedQuery.data ?? [],
    [assignedQuery.data],
  );
  const assignedIds = useMemo(
    () => new Set(assignedUsers.map((user) => user.id)),
    [assignedUsers],
  );

  const employees = useMemo(() => {
    const pages = employeesQuery.data?.pages ?? [];
    return pages.flatMap((page) =>
      page.isSuccess ? (page.data?.data ?? []) : [],
    );
  }, [employeesQuery.data?.pages]);

  const personName = (person: Pick<TEmployee, "firstName" | "lastName">) =>
    [person.firstName, person.lastName].filter(Boolean).join(" ").trim();

  const toggleUserAssignment = async (
    user: TEmployee | TProjectUser,
    include: boolean,
  ) => {
    if (!canSetAssignments || togglingUserId) return;
    const userId = user.id;
    setTogglingUserId(userId);
    try {
      const currentProjects = await readAllPages((page) =>
        projectEmployeeService.userProjects(userId, {
          page,
          pageSize: EMPLOYEE_PAGE_SIZE,
        }),
      );
      const ids = currentProjects.map((item) => item.id);
      const next = include
        ? [...new Set([...ids, project.id])]
        : ids.filter((id) => id !== project.id);

      const response = await projectEmployeeService.setUserProjects(userId, {
        userId,
        projectIds: next,
      });
      if (!response.isSuccess) {
        toast.error(response.message || t("projects.team.assignmentFailed"));
        return;
      }
      toast.success(
        include
          ? t("projects.team.assignmentAdded")
          : t("projects.team.assignmentRemoved"),
      );
      await invalidateProjectAssignedUsers(project.id);
    } catch {
      toast.error(t("projects.team.assignmentFailed"));
    } finally {
      setTogglingUserId(null);
    }
  };

  return {
    canGetAssignments,
    canSetAssignments,
    canGetEmployees,
    assignedUsers,
    assignedQuery,
    assignedIds,
    employees,
    employeesQuery,
    employeeSearch,
    setEmployeeSearch,
    togglingUserId,
    personName,
    toggleUserAssignment,
  };
};
