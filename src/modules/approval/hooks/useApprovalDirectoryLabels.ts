import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { applicationRoleService } from "@/modules/userControl/api/services/applicationRole.service";
import { employeeService } from "@/modules/userControl/api/services/employee.service";
import { applicationRoleQueryKey } from "@/modules/userControl/api/queryKeys/applicationRoleQueryKeys";
import { employeeQueryRootKey } from "@/modules/userControl/api/queryKeys/employeeQueryKeys";
import type { TApplicationRole, TEmployee } from "@/modules/userControl/types";

type Params = {
  roleIds: string[];
  employeeIds: string[];
  canGetRoles: boolean;
  canGetEmployees: boolean;
};

const uniqueIds = (ids: string[]) =>
  [...new Set(ids.map((id) => id.trim()).filter(Boolean))];

export const useApprovalDirectoryLabels = ({
  roleIds,
  employeeIds,
  canGetRoles,
  canGetEmployees,
}: Params) => {
  const uniqueRoleIds = useMemo(() => uniqueIds(roleIds), [roleIds]);
  const uniqueEmployeeIds = useMemo(() => uniqueIds(employeeIds), [employeeIds]);

  const roleQueries = useQueries({
    queries: uniqueRoleIds.map((roleId) => ({
      queryKey: applicationRoleQueryKey(roleId),
      queryFn: () => applicationRoleService.get(roleId),
      enabled: canGetRoles,
      staleTime: 5 * 60_000,
    })),
  });

  const employeeQueries = useQueries({
    queries: uniqueEmployeeIds.map((employeeId) => ({
      queryKey: [...employeeQueryRootKey, "approvalLabel", employeeId] as const,
      queryFn: async () => {
        const response = await employeeService.list({
          search: employeeId,
          pageSize: 10,
        });
        if (!response.isSuccess || !response.data?.data) return null;
        return (
          response.data.data.find((employee) => employee.id === employeeId) ??
          null
        );
      },
      enabled: canGetEmployees,
      staleTime: 5 * 60_000,
    })),
  });

  const roles = useMemo(() => {
    const map = new Map<string, TApplicationRole>();
    for (const query of roleQueries) {
      if (!query.data?.isSuccess || !query.data.data) continue;
      const role = query.data.data;
      map.set(role.id, {
        id: role.id,
        name: role.name,
        description: role.description,
        companyId: role.companyId,
        isShared: role.isShared,
        permissionsCount: role.permissions?.length ?? 0,
        usersCount: role.usersCount,
      });
    }
    return map;
  }, [roleQueries]);

  const employees = useMemo(() => {
    const map = new Map<string, TEmployee>();
    for (const query of employeeQueries) {
      const employee = query.data;
      if (!employee) continue;
      map.set(employee.id, employee);
    }
    return map;
  }, [employeeQueries]);

  return { roles, employees };
};
