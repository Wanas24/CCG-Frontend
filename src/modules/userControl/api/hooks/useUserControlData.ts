import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { applicationRoleService } from "../services/applicationRole.service";
import { employeeService } from "../services/employee.service";
import { projectEmployeeService } from "../services/projectEmployee.service";
import { useGetApplicationRolePermissions } from "./useGetApplicationRolePermissions";
import { useGetApplicationRoles } from "./useGetApplicationRoles";
import { useGetEmployees } from "./useGetEmployees";
import { useGetActiveProjects } from "./useGetActiveProjects";
import {
  applicationRoleQueryKey,
  applicationRoleQueryRootKey,
  userRolesQueryKey,
} from "../queryKeys/applicationRoleQueryKeys";
import { employeeQueryRootKey } from "../queryKeys/employeeQueryKeys";
import { projectEmployeeQueryRootKey } from "../queryKeys/projectEmployeeQueryKeys";
import { readAllPages, USER_CONTROL_PAGE_SIZE } from "./userControlPaging";
import { isForbiddenError } from "../../utils/readApiMessage";
import type {
  TApplicationRole,
  TApplicationRoleVisibility,
  TEmployee,
  TProjectWithUsers,
} from "../../types";

export type UserControlDeniedResource =
  | "employees"
  | "roles"
  | "permissions"
  | "projects"
  | "assignments";

export type UserRoleStatus = "loading" | "ready" | "forbidden" | "error";

export type RolePermissionStatus = "loading" | "ready" | "error";

export type UserControlListFilters = {
  employeeSearch: string;
  roleSearch: string;
  roleVisibility?: TApplicationRoleVisibility;
  permissionSearch: string;
  drawerPermissionSearch: string;
};

type PagedBody<T> = {
  isSuccess: boolean;
  data?: { data: T[]; totalCount: number } | null;
};

type PagedListQuery = {
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  data?: { pages: { isSuccess: boolean; data?: unknown }[] };
};

const isListFailed = (query: PagedListQuery) => {
  const pages = query.data?.pages ?? [];
  if (pages.some((page) => page.isSuccess && page.data)) return false;
  if (query.isError) return true;
  const firstPage = pages[0];
  return Boolean(query.isSuccess && firstPage && !firstPage.isSuccess);
};

const readPages = <T>(pages: PagedBody<T>[] | undefined) =>
  (pages ?? []).flatMap((page) =>
    page.isSuccess && page.data ? page.data.data : [],
  );

const readTotal = <T>(pages: PagedBody<T>[] | undefined) => {
  const page = (pages ?? []).find((item) => item.isSuccess && item.data);
  return page?.data?.totalCount ?? 0;
};

const listStatus = (query: PagedListQuery) =>
  query.isPending
    ? ("loading" as const)
    : isListFailed(query)
      ? ("error" as const)
      : ("ready" as const);

const countFrom = <T>(items: T[] | undefined, count: (rows: T[]) => number) =>
  items ? count(items) : null;

const byId = <T extends { id: string | number }>(items: T[]) => {
  const map = new Map<T["id"], T>();
  items.forEach((item) => map.set(item.id, item));
  return map;
};

export const useUserControlData = ({
  employeeSearch,
  roleSearch,
  roleVisibility,
  permissionSearch,
  drawerPermissionSearch,
}: UserControlListFilters) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const canQuery = isAuthenticated && companyId !== null;
  const employeeSearchActive = employeeSearch.length > 0;
  const roleSearchActive =
    roleSearch.length > 0 || roleVisibility !== undefined;
  const permissionSearchActive = permissionSearch.length > 0;
  const drawerSearchActive = drawerPermissionSearch.length > 0;

  const employeesQuery = useGetEmployees();
  const rolesQuery = useGetApplicationRoles();
  const permissionsQuery = useGetApplicationRolePermissions();
  const projectsQuery = useGetActiveProjects();
  const employeeSearchQuery = useGetEmployees(
    { search: employeeSearch },
    employeeSearchActive,
  );
  const roleSearchQuery = useGetApplicationRoles(
    {
      ...(roleSearch ? { search: roleSearch } : {}),
      ...(roleVisibility !== undefined ? { visibility: roleVisibility } : {}),
    },
    roleSearchActive,
  );
  const permissionSearchQuery = useGetApplicationRolePermissions(
    { search: permissionSearch },
    permissionSearchActive,
  );
  const drawerPermissionQuery = useGetApplicationRolePermissions(
    { search: drawerPermissionSearch },
    drawerSearchActive,
  );

  const employeeDirectoryQuery = useQuery({
    queryKey: [...employeeQueryRootKey, "directory"],
    queryFn: () =>
      readAllPages((page) =>
        employeeService.list({ page, pageSize: USER_CONTROL_PAGE_SIZE }),
      ),
    enabled: canQuery,
  });
  const roleDirectoryQuery = useQuery({
    queryKey: [...applicationRoleQueryRootKey, "directory"],
    queryFn: () =>
      readAllPages((page) =>
        applicationRoleService.list({ page, pageSize: USER_CONTROL_PAGE_SIZE }),
      ),
    enabled: canQuery,
  });
  const permissionDirectoryQuery = useQuery({
    queryKey: [...applicationRoleQueryRootKey, "permission-directory"],
    queryFn: () =>
      readAllPages((page) =>
        applicationRoleService.getPermissions({
          page,
          pageSize: USER_CONTROL_PAGE_SIZE,
        }),
      ),
    enabled: canQuery,
  });
  const projectDirectoryQuery = useQuery({
    queryKey: [...projectEmployeeQueryRootKey, "directory"],
    queryFn: () =>
      readAllPages((page) =>
        projectEmployeeService.projects({
          page,
          pageSize: USER_CONTROL_PAGE_SIZE,
        }),
      ),
    enabled: canQuery,
  });

  const employees = useMemo(
    () => readPages(employeesQuery.data?.pages),
    [employeesQuery.data?.pages],
  );
  const roles = useMemo(
    () => readPages(rolesQuery.data?.pages),
    [rolesQuery.data?.pages],
  );
  const groups = useMemo(
    () => readPages(permissionsQuery.data?.pages),
    [permissionsQuery.data?.pages],
  );
  const projects = useMemo(
    () => readPages(projectsQuery.data?.pages),
    [projectsQuery.data?.pages],
  );
  const searchedEmployees = useMemo(
    () => readPages(employeeSearchQuery.data?.pages),
    [employeeSearchQuery.data?.pages],
  );
  const searchedRoles = useMemo(
    () => readPages(roleSearchQuery.data?.pages),
    [roleSearchQuery.data?.pages],
  );
  const searchedGroups = useMemo(
    () => readPages(permissionSearchQuery.data?.pages),
    [permissionSearchQuery.data?.pages],
  );
  const searchedDrawerGroups = useMemo(
    () => readPages(drawerPermissionQuery.data?.pages),
    [drawerPermissionQuery.data?.pages],
  );

  const boardEmployees = employeeSearchActive ? searchedEmployees : employees;
  const boardRoles = roleSearchActive ? searchedRoles : roles;
  const catalogGroups = permissionSearchActive ? searchedGroups : groups;
  const drawerGroups = drawerSearchActive ? searchedDrawerGroups : groups;

  const employeesTotal = readTotal(employeesQuery.data?.pages);
  const rolesTotal = readTotal(rolesQuery.data?.pages);
  const groupsTotal = permissionDirectoryQuery.data
    ? permissionDirectoryQuery.data.length
    : readTotal(permissionsQuery.data?.pages);
  const permissionTotal = permissionDirectoryQuery.data
    ? permissionDirectoryQuery.data.reduce(
        (total, group) => total + group.actions.length,
        0,
      )
    : groups.reduce((total, group) => total + group.actions.length, 0);

  const activeEmployees = countFrom(
    employeeDirectoryQuery.data,
    (rows) =>
      rows.filter((employee) => employee.isActive && !employee.isFired).length,
  );
  const assignments = countFrom(employeeDirectoryQuery.data, (rows) =>
    rows.reduce((total, employee) => total + employee.rolesCount, 0),
  );
  const withoutRole = countFrom(
    employeeDirectoryQuery.data,
    (rows) =>
      rows.filter(
        (employee) => !employee.isManager && employee.rolesCount === 0,
      ).length,
  );
  const sharedRoles = countFrom(
    roleDirectoryQuery.data,
    (rows) => rows.filter((role) => role.isShared).length,
  );
  const companyRoles = countFrom(
    roleDirectoryQuery.data,
    (rows) => rows.filter((role) => !role.isShared).length,
  );

  const loadMore = (query: {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
  }) => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    void query.fetchNextPage();
  };

  const listsReady =
    employeesQuery.isSuccess &&
    Boolean(employeesQuery.data?.pages[0]?.isSuccess);
  const rolesReady =
    rolesQuery.isSuccess && Boolean(rolesQuery.data?.pages[0]?.isSuccess);

  const people = useMemo(() => {
    const map = new Map<string, TEmployee>();
    employees.forEach((employee) => map.set(employee.id, employee));
    boardEmployees.forEach((employee) => map.set(employee.id, employee));
    return [...map.values()];
  }, [boardEmployees, employees]);

  const knownRoles = useMemo(() => {
    const map = new Map<string, TApplicationRole>();
    roles.forEach((role) => map.set(role.id, role));
    boardRoles.forEach((role) => map.set(role.id, role));
    return [...map.values()];
  }, [boardRoles, roles]);

  const userRoleQueries = useQueries({
    queries: people.map((employee) => ({
      queryKey: userRolesQueryKey(employee.id),
      queryFn: () => applicationRoleService.getUserRoles(employee.id),
      enabled: canQuery && listsReady,
    })),
  });

  const roleDetailQueries = useQueries({
    queries: knownRoles.map((role) => ({
      queryKey: applicationRoleQueryKey(role.id),
      queryFn: () => applicationRoleService.get(role.id),
      enabled: canQuery && rolesReady,
    })),
  });

  const { userRoles, userRoleStatus, roleCatalog } = useMemo(() => {
    const assigned = new Map<string, Set<string>>();
    const status = new Map<string, UserRoleStatus>();
    const catalog = new Map<string, TApplicationRole>();
    roleDirectoryQuery.data?.forEach((role) => catalog.set(role.id, role));
    knownRoles.forEach((role) => catalog.set(role.id, role));

    people.forEach((employee, index) => {
      const query = userRoleQueries[index];
      if (!query || query.isPending) {
        status.set(employee.id, "loading");
        return;
      }
      if (query.isError) {
        status.set(
          employee.id,
          isForbiddenError(query.error) ? "forbidden" : "error",
        );
        return;
      }
      if (!query.data?.isSuccess || !query.data.data) {
        status.set(employee.id, "error");
        return;
      }
      status.set(employee.id, "ready");
      query.data.data.forEach((role) => {
        if (!catalog.has(role.id)) catalog.set(role.id, role);
      });
      assigned.set(
        employee.id,
        new Set(query.data.data.map((role) => role.id)),
      );
    });

    return {
      userRoles: assigned,
      userRoleStatus: status,
      roleCatalog: catalog,
    };
  }, [knownRoles, people, roleDirectoryQuery.data, userRoleQueries]);

  const { rolePerms, permissionsReady, rolePermissionStatus } = useMemo(() => {
    const map = new Map<string, Set<number>>();
    const ready = new Set<string>();
    const status = new Map<string, RolePermissionStatus>();
    knownRoles.forEach((role, index) => {
      const query = roleDetailQueries[index];
      if (!query || query.isPending) {
        status.set(role.id, "loading");
        return;
      }
      if (query.isError || !query.data?.isSuccess || !query.data.data) {
        status.set(role.id, "error");
        return;
      }
      status.set(role.id, "ready");
      ready.add(role.id);
      map.set(
        role.id,
        new Set(
          query.data.data.permissions
            .map((permission) => Number(permission.id))
            .filter((id) => !Number.isNaN(id)),
        ),
      );
    });
    return {
      rolePerms: map,
      permissionsReady: ready,
      rolePermissionStatus: status,
    };
  }, [knownRoles, roleDetailQueries]);

  const userProjects = useMemo(() => {
    const map = new Map<string, { id: number; name: string }[]>();
    projectDirectoryQuery.data?.forEach((project) => {
      project.users.forEach((user) => {
        const current = map.get(user.id) ?? [];
        current.push({ id: project.id, name: project.name });
        map.set(user.id, current);
      });
    });
    return map;
  }, [projectDirectoryQuery.data]);

  const employeeCatalog = useMemo(() => byId(people), [people]);
  const projectCatalog = useMemo(() => {
    const map = new Map<number, TProjectWithUsers>();
    projects.forEach((project) => map.set(project.id, project));
    projectDirectoryQuery.data?.forEach((project) =>
      map.set(project.id, project),
    );
    return map;
  }, [projectDirectoryQuery.data, projects]);

  const userRolesForbidden = userRoleQueries.some(
    (query) => query.isError && isForbiddenError(query.error),
  );

  const denied = useMemo(() => {
    const resources: UserControlDeniedResource[] = [];
    if (employeesQuery.isError && isForbiddenError(employeesQuery.error)) {
      resources.push("employees");
    }
    if (rolesQuery.isError && isForbiddenError(rolesQuery.error)) {
      resources.push("roles");
    }
    if (permissionsQuery.isError && isForbiddenError(permissionsQuery.error)) {
      resources.push("permissions");
    }
    if (projectsQuery.isError && isForbiddenError(projectsQuery.error)) {
      resources.push("projects");
    }
    if (userRolesForbidden) resources.push("assignments");
    return resources;
  }, [
    employeesQuery.error,
    employeesQuery.isError,
    permissionsQuery.error,
    permissionsQuery.isError,
    projectsQuery.error,
    projectsQuery.isError,
    rolesQuery.error,
    rolesQuery.isError,
    userRolesForbidden,
  ]);

  const queryErrors = useMemo(
    () => [
      {
        key: "employees",
        error: employeesQuery.error,
        updatedAt: employeesQuery.errorUpdatedAt,
      },
      {
        key: "roles",
        error: rolesQuery.error,
        updatedAt: rolesQuery.errorUpdatedAt,
      },
      {
        key: "permissions",
        error: permissionsQuery.error,
        updatedAt: permissionsQuery.errorUpdatedAt,
      },
      {
        key: "projects",
        error: projectsQuery.error,
        updatedAt: projectsQuery.errorUpdatedAt,
      },
    ],
    [
      employeesQuery.error,
      employeesQuery.errorUpdatedAt,
      rolesQuery.error,
      rolesQuery.errorUpdatedAt,
      permissionsQuery.error,
      permissionsQuery.errorUpdatedAt,
      projectsQuery.error,
      projectsQuery.errorUpdatedAt,
    ],
  );

  const lists = [employeesQuery, rolesQuery, permissionsQuery, projectsQuery];
  const allFailed = lists.every(
    (query) => query.isFetched && isListFailed(query),
  );
  const isInitialLoading = lists.some((query) => query.isPending);
  const isFetching =
    lists.some((query) => query.isFetching && !query.isFetchingNextPage) ||
    employeeDirectoryQuery.isFetching ||
    roleDirectoryQuery.isFetching ||
    permissionDirectoryQuery.isFetching ||
    projectDirectoryQuery.isFetching;
  const userRolesReady =
    people.length === 0
      ? listsReady
      : userRoleQueries.every((query) => query.isFetched);

  const userRolesKey = people
    .map((employee) => {
      const status = userRoleStatus.get(employee.id) ?? "loading";
      const ids =
        status === "ready"
          ? [...(userRoles.get(employee.id) ?? [])].sort().join(",")
          : "";
      return `${employee.id}:${status}:${ids}`;
    })
    .join("|");

  const rolePermsKey = knownRoles
    .map((role) => {
      const status = rolePermissionStatus.get(role.id) ?? "loading";
      const ids = [...(rolePerms.get(role.id) ?? [])]
        .sort((a, b) => a - b)
        .join(",");
      return `${role.id}:${status}:${ids}`;
    })
    .join("|");

  const boardEmployeesQuery = employeeSearchActive
    ? employeeSearchQuery
    : employeesQuery;
  const boardRolesQuery = roleSearchActive ? roleSearchQuery : rolesQuery;
  const catalogQuery = permissionSearchActive
    ? permissionSearchQuery
    : permissionsQuery;
  const drawerGroupsQuery = drawerSearchActive
    ? drawerPermissionQuery
    : permissionsQuery;

  return {
    employees,
    employeesTotal,
    employeesPending: employeesQuery.isPending,
    employeesHasNext: employeesQuery.hasNextPage,
    employeesLoadingMore: employeesQuery.isFetchingNextPage,
    loadMoreEmployees: () => loadMore(employeesQuery),
    boardEmployees,
    boardEmployeesPending: boardEmployeesQuery.isPending,
    boardEmployeesFailed: isListFailed(boardEmployeesQuery),
    boardEmployeesHasNext: boardEmployeesQuery.hasNextPage,
    boardEmployeesLoadingMore: boardEmployeesQuery.isFetchingNextPage,
    loadMoreBoardEmployees: () => loadMore(boardEmployeesQuery),
    roles,
    rolesTotal,
    rolesPending: rolesQuery.isPending,
    rolesHasNext: rolesQuery.hasNextPage,
    rolesLoadingMore: rolesQuery.isFetchingNextPage,
    loadMoreRoles: () => loadMore(rolesQuery),
    boardRoles,
    boardRolesPending: boardRolesQuery.isPending,
    boardRolesFailed: isListFailed(boardRolesQuery),
    boardRolesHasNext: boardRolesQuery.hasNextPage,
    boardRolesLoadingMore: boardRolesQuery.isFetchingNextPage,
    loadMoreBoardRoles: () => loadMore(boardRolesQuery),
    groups,
    groupsTotal,
    permissionTotal,
    permissionStatsStatus: permissionDirectoryQuery.isPending
      ? ("loading" as const)
      : permissionDirectoryQuery.isSuccess
        ? ("ready" as const)
        : ("error" as const),
    groupsPending: permissionsQuery.isPending,
    groupsHasNext: permissionsQuery.hasNextPage,
    groupsLoadingMore: permissionsQuery.isFetchingNextPage,
    loadMoreGroups: () => loadMore(permissionsQuery),
    catalogGroups,
    catalogPending: catalogQuery.isPending,
    catalogFailed: isListFailed(catalogQuery),
    catalogHasNext: catalogQuery.hasNextPage,
    catalogLoadingMore: catalogQuery.isFetchingNextPage,
    loadMoreCatalog: () => loadMore(catalogQuery),
    drawerGroups,
    drawerGroupsHasNext: drawerGroupsQuery.hasNextPage,
    drawerGroupsLoadingMore: drawerGroupsQuery.isFetchingNextPage,
    loadMoreDrawerGroups: () => loadMore(drawerGroupsQuery),
    projects,
    projectsHasNext: projectsQuery.hasNextPage,
    projectsLoadingMore: projectsQuery.isFetchingNextPage,
    loadMoreProjects: () => loadMore(projectsQuery),
    projectsStatus: listStatus(projectsQuery),
    projectAccessStatus: projectDirectoryQuery.isPending
      ? ("loading" as const)
      : projectDirectoryQuery.isError
        ? ("error" as const)
        : ("ready" as const),
    userRoles,
    userRoleStatus,
    roleCatalog,
    employeeCatalog,
    projectCatalog,
    rolePerms,
    permissionsReady,
    rolePermissionStatus,
    userProjects,
    userRolesReady,
    userRolesKey,
    rolePermsKey,
    activeEmployees,
    sharedRoles,
    companyRoles,
    assignments,
    withoutRole,
    employeeStatsStatus: employeeDirectoryQuery.isPending
      ? ("loading" as const)
      : employeeDirectoryQuery.isSuccess
        ? ("ready" as const)
        : ("error" as const),
    roleStatsStatus: roleDirectoryQuery.isPending
      ? ("loading" as const)
      : roleDirectoryQuery.isSuccess
        ? ("ready" as const)
        : ("error" as const),
    denied,
    allFailed,
    isInitialLoading,
    isFetching,
    employeesFailed: isListFailed(employeesQuery),
    rolesFailed: isListFailed(rolesQuery),
    permissionsFailed: isListFailed(permissionsQuery),
    queryErrors,
  };
};
