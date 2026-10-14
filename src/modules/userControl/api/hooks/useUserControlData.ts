import { useEffect, useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { applicationRoleService } from "../services/applicationRole.service";
import { projectEmployeeService } from "../services/projectEmployee.service";
import { useGetApplicationRolePermissions } from "./useGetApplicationRolePermissions";
import { useGetApplicationRoles } from "./useGetApplicationRoles";
import { useGetEmployees } from "./useGetEmployees";
import {
  applicationRoleQueryKey,
  userRolesQueryKey,
} from "../queryKeys/applicationRoleQueryKeys";
import { projectEmployeeDirectoryQueryKey } from "../queryKeys/projectEmployeeQueryKeys";
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
  fetchProjects?: boolean;
  fetchAllRoleDetails?: boolean;
  activeRoleDetailId?: string | null;
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
  fetchProjects = false,
  fetchAllRoleDetails = false,
  activeRoleDetailId = null,
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

  const {
    hasNextPage: permissionsHasNextPage,
    isFetchingNextPage: permissionsFetchingNextPage,
    isPending: permissionsPending,
    dataUpdatedAt: permissionsDataUpdatedAt,
    fetchNextPage: fetchNextPermissionsPage,
  } = permissionsQuery;

  useEffect(() => {
    if (!canQuery || permissionSearchActive) return;
    if (
      !permissionsHasNextPage ||
      permissionsFetchingNextPage ||
      permissionsPending
    ) {
      return;
    }
    void fetchNextPermissionsPage();
  }, [
    canQuery,
    fetchNextPermissionsPage,
    permissionSearchActive,
    permissionsDataUpdatedAt,
    permissionsFetchingNextPage,
    permissionsHasNextPage,
    permissionsPending,
  ]);

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
  const catalogQueryForTotal = permissionSearchActive
    ? permissionSearchQuery
    : permissionsQuery;
  const groupsTotal = readTotal(catalogQueryForTotal.data?.pages);
  const permissionTotal = groups.reduce(
    (total, group) => total + group.actions.length,
    0,
  );
  const permissionsCatalogComplete =
    permissionsQuery.isSuccess &&
    Boolean(permissionsQuery.data?.pages[0]?.isSuccess) &&
    !permissionsQuery.hasNextPage;

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

  const projectDirectoryQuery = useQuery({
    queryKey: projectEmployeeDirectoryQueryKey,
    queryFn: () =>
      readAllPages((page) =>
        projectEmployeeService.projects({
          page,
          pageSize: USER_CONTROL_PAGE_SIZE,
        }),
      ),
    enabled: canQuery && fetchProjects && listsReady,
  });

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
      enabled:
        canQuery &&
        rolesReady &&
        (fetchAllRoleDetails || role.id === activeRoleDetailId),
    })),
  });

  const { userRoles, userRoleStatus, roleCatalog } = useMemo(() => {
    const assigned = new Map<string, Set<string>>();
    const status = new Map<string, UserRoleStatus>();
    const catalog = new Map<string, TApplicationRole>();
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
  }, [knownRoles, people, userRoleQueries]);

  const { rolePerms, permissionsReady, rolePermissionStatus } = useMemo(() => {
    const map = new Map<string, Set<number>>();
    const ready = new Set<string>();
    const status = new Map<string, RolePermissionStatus>();
    knownRoles.forEach((role, index) => {
      const query = roleDetailQueries[index];
      const shouldLoad =
        fetchAllRoleDetails || role.id === activeRoleDetailId;
      if (!shouldLoad) {
        status.set(role.id, "loading");
        return;
      }
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
  }, [
    activeRoleDetailId,
    fetchAllRoleDetails,
    knownRoles,
    roleDetailQueries,
  ]);

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
    projectDirectoryQuery.data?.forEach((project) =>
      map.set(project.id, project),
    );
    return map;
  }, [projectDirectoryQuery.data]);

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
    if (
      fetchProjects &&
      projectDirectoryQuery.isError &&
      isForbiddenError(projectDirectoryQuery.error)
    ) {
      resources.push("projects");
    }
    if (userRolesForbidden) resources.push("assignments");
    return resources;
  }, [
    employeesQuery.error,
    employeesQuery.isError,
    fetchProjects,
    permissionsQuery.error,
    permissionsQuery.isError,
    projectDirectoryQuery.error,
    projectDirectoryQuery.isError,
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
        error: fetchProjects ? projectDirectoryQuery.error : null,
        updatedAt: fetchProjects ? projectDirectoryQuery.errorUpdatedAt : 0,
      },
    ],
    [
      employeesQuery.error,
      employeesQuery.errorUpdatedAt,
      fetchProjects,
      rolesQuery.error,
      rolesQuery.errorUpdatedAt,
      permissionsQuery.error,
      permissionsQuery.errorUpdatedAt,
      projectDirectoryQuery.error,
      projectDirectoryQuery.errorUpdatedAt,
    ],
  );

  const lists = [employeesQuery, rolesQuery, permissionsQuery];
  const allFailed = lists.every(
    (query) => query.isFetched && isListFailed(query),
  );
  const isInitialLoading = lists.some((query) => query.isPending);
  const isFetching =
    lists.some((query) => query.isFetching && !query.isFetchingNextPage) ||
    (fetchProjects && projectDirectoryQuery.isFetching);
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

  const projectStatus = !fetchProjects
    ? ("loading" as const)
    : projectDirectoryQuery.isPending
      ? ("loading" as const)
      : projectDirectoryQuery.isError
        ? ("error" as const)
        : ("ready" as const);

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
    permissionStatsStatus: permissionsQuery.isPending
      ? ("loading" as const)
      : isListFailed(permissionsQuery)
        ? ("error" as const)
        : permissionsCatalogComplete
          ? ("ready" as const)
          : ("loading" as const),
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
    projects: [] as TProjectWithUsers[],
    projectsHasNext: false,
    projectsLoadingMore: false,
    loadMoreProjects: () => undefined,
    projectsStatus: projectStatus,
    projectAccessStatus: projectStatus,
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
    activeEmployees: null,
    sharedRoles: null,
    companyRoles: null,
    assignments: null,
    withoutRole: null,
    employeeStatsStatus: "ready" as const,
    roleStatsStatus: "ready" as const,
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
