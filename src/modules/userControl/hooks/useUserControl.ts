import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { queryClient } from "@/lib/queryClient";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useUserControlData } from "../api/hooks/useUserControlData";
import { useAssignApplicationRole } from "../api/hooks/useAssignApplicationRole";
import { useDeleteApplicationRole } from "../api/hooks/useDeleteApplicationRole";
import { useSetApplicationRolePermissions } from "../api/hooks/useSetApplicationRolePermissions";
import { useUnassignApplicationRole } from "../api/hooks/useUnassignApplicationRole";
import { applicationRoleQueryRootKey } from "../api/queryKeys/applicationRoleQueryKeys";
import { employeeQueryRootKey } from "../api/queryKeys/employeeQueryKeys";
import { projectEmployeeQueryRootKey } from "../api/queryKeys/projectEmployeeQueryKeys";
import { ApplicationRoleVisibility } from "../types";
import type { ConfirmState, UserControlDrawerState } from "../types";
import { isForbiddenError, readApiMessage } from "../utils/readApiMessage";
import { personName, setsEqual, withUserRole } from "../utils/userControlDisplay";
import { useUserControlInvite } from "./useUserControlInvite";
import { useUserControlRoleForm } from "./useUserControlRoleForm";

export const useUserControl = () => {
  const { t } = useTranslation();

  const [employeeSearch, setEmployeeSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "company" | "shared">("all");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [drawer, setDrawer] = useState<UserControlDrawerState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const [debouncedEmployeeSearch] = useDebounce(employeeSearch.trim(), 300);
  const [debouncedRoleSearch] = useDebounce(roleSearch.trim(), 300);
  const [debouncedPermissionSearch] = useDebounce(permissionSearch.trim(), 300);
  const [debouncedProjectSearch] = useDebounce(projectSearch.trim(), 300);
  const [debouncedDrawerPermissionSearch] = useDebounce((drawer?.query ?? "").trim(), 300);

  const data = useUserControlData({
    employeeSearch: debouncedEmployeeSearch,
    roleSearch: debouncedRoleSearch,
    roleVisibility:
      roleFilter === "shared"
        ? ApplicationRoleVisibility.Shared
        : roleFilter === "company"
          ? ApplicationRoleVisibility.Mine
          : undefined,
    permissionSearch: debouncedPermissionSearch,
    projectSearch: debouncedProjectSearch,
    drawerPermissionSearch: debouncedDrawerPermissionSearch,
  });
  const { queryErrors, ...listData } = data;

  const { hasPermission, isAdmin, isManager, isLoading: permissionsLoading } =
    usePermissions();

  const can = (permission: string) =>
    !permissionsLoading && (isAdmin || isManager || hasPermission(permission));

  const canRecruit = can(PermissionsList.Employee.RecruitEmployee);
  const canCreateRole = can(PermissionsList.ApplicationRole.Create);
  const canEditRole = can(PermissionsList.ApplicationRole.Edit);
  const canDeleteRole = can(PermissionsList.ApplicationRole.Delete);
  const canSetPermissions = can(PermissionsList.ApplicationRole.AssignPermissions);
  const canAssign = can(PermissionsList.ApplicationRole.AssignRoleToUser);
  const canUnassign = can(PermissionsList.ApplicationRole.UnassignRoleFromUser);
  const canSetUserRoles = can(PermissionsList.ApplicationRole.EditUserRoles);
  const canSetProjects = can(PermissionsList.ProjectEmployee.SetProjects);

  const deleteRoleMutation = useDeleteApplicationRole();
  const setPermissionsMutation = useSetApplicationRolePermissions();
  const assignMutation = useAssignApplicationRole();
  const unassignMutation = useUnassignApplicationRole();

  const [userRoleOverride, setUserRoleOverride] = useState<Map<string, Set<string>> | null>(null);
  const [rolePermOverride, setRolePermOverride] = useState<Map<string, Set<number>> | null>(null);
  const userRoleWrites = useRef(0);
  const rolePermWrites = useRef(0);
  const reportedErrors = useRef<Record<string, number>>({});

  const userRoles = userRoleOverride ?? data.userRoles;
  const rolePerms = rolePermOverride ?? data.rolePerms;

  useEffect(() => {
    if (userRoleWrites.current === 0) setUserRoleOverride(null);
  }, [data.userRolesKey]);

  useEffect(() => {
    if (rolePermWrites.current === 0) setRolePermOverride(null);
  }, [data.rolePermsKey]);

  useEffect(() => {
    queryErrors.forEach(({ key, error, updatedAt }) => {
      if (!error || isForbiddenError(error) || updatedAt === 0) return;
      if (reportedErrors.current[key] === updatedAt) return;
      reportedErrors.current[key] = updatedAt;
      toast.error(readApiMessage(error, t("common.unexpectedError")));
    });
  }, [queryErrors, t]);

  const reload = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: applicationRoleQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: employeeQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: projectEmployeeQueryRootKey }),
    ]);
  };

  const openDrawer = (roleId: string) => {
    if (!data.roles.some((role) => role.id === roleId)) return;
    setDrawer({
      roleId,
      tab: "perms",
      query: "",
      draft: new Set(rolePerms.get(roleId) ?? []),
      touched: false,
    });
  };

  const openCreatedRoleDrawer = (roleId: string) => {
    setDrawer({
      roleId,
      tab: "perms",
      query: "",
      draft: new Set(),
      touched: false,
    });
  };

  const { cleanupRole, ...inviteModel } = useUserControlInvite({
    data: {
      isInitialLoading: data.isInitialLoading,
      roles: data.roles,
      projectsStatus: data.projectsStatus,
      projects: data.projects,
      groups: data.groups,
      rolesFailed: data.rolesFailed,
      roleCatalog: data.roleCatalog,
      projectCatalog: data.projectCatalog,
    },
    rolePerms,
    canSetUserRoles,
    canSetProjects,
    reload,
  });

  const roleFormModel = useUserControlRoleForm({
    roleCatalog: data.roleCatalog,
    canCreateRole,
    canEditRole,
    reload,
    onCreated: openCreatedRoleDrawer,
  });

  const drawerDraft = useMemo(() => {
    if (!drawer) return new Set<number>();
    if (drawer.touched) return drawer.draft;
    return rolePerms.get(drawer.roleId) ?? drawer.draft;
  }, [drawer, rolePerms]);

  const requestCloseDrawer = () => {
    if (!drawer) return;
    const saved = rolePerms.get(drawer.roleId) ?? new Set<number>();
    if (drawer.touched && !setsEqual(saved, drawerDraft)) {
      setConfirmState({ kind: "discard" });
      return;
    }
    setDrawer(null);
  };

  const saveRolePermissions = async (
    roleId: string,
    permissionIds: number[],
    successMessage: string,
  ) => {
    const role = data.roleCatalog.get(roleId);
    if (!role) return false;
    if (role.isShared || !canSetPermissions) {
      if (role.isShared) toast.warning(t("userControl.toast.sharedReadOnly"));
      return false;
    }
    if (!data.permissionsReady.has(roleId)) {
      toast.info(
        data.rolePermissionStatus.get(roleId) === "error"
          ? t("userControl.toast.permissionsUnavailable")
          : t("userControl.toast.permissionsLoading"),
      );
      return false;
    }

    const unique = [...new Set(permissionIds)];
    const previous = rolePermOverride;
    const next = new Map(rolePermOverride ?? data.rolePerms);
    next.set(roleId, new Set(unique));
    setRolePermOverride(next);
    rolePermWrites.current += 1;

    try {
      const response = await setPermissionsMutation.mutateAsync({ roleId, permissionIds: unique });
      if (!response.isSuccess) {
        setRolePermOverride(previous);
        return false;
      }
      toast.success(response.message || successMessage);
      setDrawer((current) =>
        current?.roleId === roleId
          ? { ...current, draft: new Set(unique), touched: false }
          : current,
      );
      await reload();
      return true;
    } catch {
      setRolePermOverride(previous);
      return false;
    } finally {
      rolePermWrites.current -= 1;
    }
  };

  const saveDrawer = async () => {
    if (!drawer) return;
    const saved = rolePerms.get(drawer.roleId) ?? new Set<number>();
    if (!drawer.touched || setsEqual(saved, drawerDraft)) {
      toast.info(t("userControl.toast.noChanges"));
      return;
    }
    const role = data.roleCatalog.get(drawer.roleId);
    await saveRolePermissions(
      drawer.roleId,
      [...drawerDraft],
      t("userControl.toast.saved", { role: role?.name ?? "" }),
    );
  };

  const grantPermissions = async (roleId: string, permissionIds: number[]) => {
    const role = data.roleCatalog.get(roleId);
    if (!role) return;
    if (role.isShared) {
      toast.warning(t("userControl.toast.sharedReadOnly"));
      return;
    }
    if (!data.permissionsReady.has(roleId)) {
      toast.info(
        data.rolePermissionStatus.get(roleId) === "error"
          ? t("userControl.toast.permissionsUnavailable")
          : t("userControl.toast.permissionsLoading"),
      );
      return;
    }
    const current = rolePerms.get(roleId) ?? new Set<number>();
    const added = permissionIds.filter((id) => !current.has(id));
    if (added.length === 0) {
      toast.info(t("userControl.toast.alreadyGranted", { role: role.name }));
      return;
    }
    await saveRolePermissions(
      roleId,
      [...current, ...added],
      t("userControl.toast.granted", { count: added.length, role: role.name }),
    );
  };

  const togglePermissionGroup = async (roleId: string, groupName: string) => {
    const role = data.roleCatalog.get(roleId);
    const group = data.groups.find((item) => item.name === groupName);
    if (!role || !group) return;
    if (role.isShared || !canSetPermissions) {
      if (role.isShared) toast.warning(t("userControl.toast.sharedReadOnly"));
      return;
    }
    if (!data.permissionsReady.has(roleId)) {
      toast.info(
        data.rolePermissionStatus.get(roleId) === "error"
          ? t("userControl.toast.permissionsUnavailable")
          : t("userControl.toast.permissionsLoading"),
      );
      return;
    }
    const current = new Set(rolePerms.get(roleId) ?? []);
    const full = group.actions.every((action) => current.has(action.id));
    group.actions.forEach((action) => {
      if (full) current.delete(action.id);
      else current.add(action.id);
    });
    await saveRolePermissions(
      roleId,
      [...current],
      t(full ? "userControl.toast.groupRevoked" : "userControl.toast.groupGranted", {
        group: groupName,
        role: role.name,
      }),
    );
  };

  const assignRole = async (userId: string, roleId: string) => {
    if (!canAssign) return;
    if (data.userRoleStatus.get(userId) !== "ready") {
      toast.info(t("userControl.toast.rolesUnavailable"));
      return;
    }
    const employee = data.employeeCatalog.get(userId);
    const role = data.roleCatalog.get(roleId);
    if (!employee || !role) return;
    if (userRoles.get(userId)?.has(roleId)) {
      toast.info(
        t("userControl.toast.alreadyAssigned", {
          name: personName(employee),
          role: role.name,
        }),
      );
      return;
    }

    const previous = userRoleOverride;
    setUserRoleOverride(withUserRole(userRoles, userId, roleId, true));
    userRoleWrites.current += 1;
    try {
      const response = await assignMutation.mutateAsync({ userId, roleId });
      if (!response.isSuccess) {
        setUserRoleOverride(previous);
        return;
      }
      toast.success(
        response.message ||
          t("userControl.toast.assigned", {
            role: role.name,
            name: personName(employee),
          }),
      );
      await reload();
    } catch {
      setUserRoleOverride(previous);
    } finally {
      userRoleWrites.current -= 1;
    }
  };

  const unassignRole = async (userId: string, roleId: string) => {
    if (!canUnassign) return;
    if (data.userRoleStatus.get(userId) !== "ready") {
      toast.info(t("userControl.toast.rolesUnavailable"));
      return;
    }
    const employee = data.employeeCatalog.get(userId);
    const role = data.roleCatalog.get(roleId);
    const previous = userRoleOverride;
    setUserRoleOverride(withUserRole(userRoles, userId, roleId, false));
    userRoleWrites.current += 1;
    try {
      const response = await unassignMutation.mutateAsync({ userId, roleId });
      if (!response.isSuccess) {
        setUserRoleOverride(previous);
        return;
      }
      toast.success(
        response.message ||
          t("userControl.toast.unassigned", {
            role: role?.name ?? "",
            name: employee ? personName(employee) : "",
          }),
      );
      await reload();
    } catch {
      setUserRoleOverride(previous);
    } finally {
      userRoleWrites.current -= 1;
    }
  };

  const requestDeleteRole = (roleId: string) => {
    const role = data.roleCatalog.get(roleId);
    if (!role || role.isShared || !canDeleteRole) return;
    setConfirmState({ kind: "delete", role });
  };

  const acceptConfirm = async () => {
    if (!confirmState) return;

    if (confirmState.kind === "discard") {
      setDrawer(null);
      setConfirmState(null);
      return;
    }

    const { role } = confirmState;
    const response = await deleteRoleMutation.mutateAsync(role.id);
    if (!response.isSuccess) return;
    toast.success(
      response.message || t("userControl.toast.roleDeleted", { name: role.name }),
    );
    cleanupRole(role.id);
    setDrawer((current) => (current?.roleId === role.id ? null : current));
    setConfirmState(null);
    await reload();
  };

  const drawerRole = drawer ? data.roleCatalog.get(drawer.roleId) ?? null : null;
  const drawerDirty = Boolean(
    drawer?.touched &&
      !setsEqual(rolePerms.get(drawer.roleId) ?? new Set<number>(), drawerDraft),
  );

  const isBusy =
    data.isFetching ||
    inviteModel.invitePending ||
    roleFormModel.roleSaving ||
    deleteRoleMutation.isPending ||
    setPermissionsMutation.isPending ||
    assignMutation.isPending ||
    unassignMutation.isPending;

  return {
    ...listData,
    userRoles,
    rolePerms,
    reload,
    isBusy,
    canRecruit,
    canCreateRole,
    canEditRole,
    canDeleteRole,
    canSetPermissions,
    canAssign,
    canUnassign,
    canSetUserRoles,
    canSetProjects,
    employeeSearch,
    setEmployeeSearch,
    roleSearch,
    setRoleSearch,
    roleFilter,
    setRoleFilter,
    permissionSearch,
    setPermissionSearch,
    projectSearch,
    setProjectSearch,
    ...inviteModel,
    ...roleFormModel,
    confirmState,
    requestDeleteRole,
    cancelConfirm: () => setConfirmState(null),
    acceptConfirm,
    confirmPending: deleteRoleMutation.isPending,
    drawer,
    drawerDraft,
    drawerRole,
    drawerDirty,
    openDrawer,
    requestCloseDrawer,
    setDrawerTab: (tab: UserControlDrawerState["tab"]) =>
      setDrawer((current) => (current ? { ...current, tab } : current)),
    setDrawerQuery: (query: string) =>
      setDrawer((current) => (current ? { ...current, query } : current)),
    toggleDraftPermission: (permissionId: number, checked: boolean) =>
      setDrawer((current) => {
        if (!current) return current;
        const base = current.touched
          ? current.draft
          : (rolePerms.get(current.roleId) ?? current.draft);
        const draft = new Set(base);
        if (checked) draft.add(permissionId);
        else draft.delete(permissionId);
        return { ...current, draft, touched: true };
      }),
    toggleDraftGroup: (groupName: string, checked: boolean) => {
      const group =
        data.drawerGroups.find((item) => item.name === groupName) ??
        data.groups.find((item) => item.name === groupName);
      if (!group) return;
      setDrawer((current) => {
        if (!current) return current;
        const base = current.touched
          ? current.draft
          : (rolePerms.get(current.roleId) ?? current.draft);
        const draft = new Set(base);
        group.actions.forEach((action) => {
          if (checked) draft.add(action.id);
          else draft.delete(action.id);
        });
        return { ...current, draft, touched: true };
      });
    },
    saveDrawer,
    assignRole,
    unassignRole,
    grantPermissions,
    togglePermissionGroup,
  };
};

export type UserControlModel = ReturnType<typeof useUserControl>;
