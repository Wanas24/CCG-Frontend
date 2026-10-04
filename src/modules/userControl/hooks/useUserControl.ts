import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useUserControlData } from "../api/hooks/useUserControlData";
import { ApplicationRoleVisibility } from "../types";
import { useAssignApplicationRole } from "../api/hooks/useAssignApplicationRole";
import { useCreateApplicationRole } from "../api/hooks/useCreateApplicationRole";
import { useDeleteApplicationRole } from "../api/hooks/useDeleteApplicationRole";
import { useEditApplicationRole } from "../api/hooks/useEditApplicationRole";
import { useRecruitEmployee } from "../api/hooks/useRecruitEmployee";
import { useSetApplicationRolePermissions } from "../api/hooks/useSetApplicationRolePermissions";
import { useSetUserProjects } from "../api/hooks/useSetUserProjects";
import { useSetUserRoles } from "../api/hooks/useSetUserRoles";
import { useUnassignApplicationRole } from "../api/hooks/useUnassignApplicationRole";
import { applicationRoleQueryRootKey } from "../api/queryKeys/applicationRoleQueryKeys";
import { employeeQueryRootKey } from "../api/queryKeys/employeeQueryKeys";
import { projectEmployeeQueryRootKey } from "../api/queryKeys/projectEmployeeQueryKeys";
import {
  inviteEmployeeSchema,
  roleFormSchema,
  type InviteEmployeeValues,
  type RoleFormValues,
} from "../schemas";
import type { TApplicationRole } from "../types";
import { isForbiddenError, readApiMessage } from "../utils/readApiMessage";
import { personName, setsEqual } from "../utils/userControlDisplay";

export type InviteStepStatus = "wait" | "run" | "ok" | "fail" | "warn" | "skip";

export type InviteRunState = {
  title: string;
  subtitle: string;
  closable: boolean;
  steps: { title: string; detail: string; status: InviteStepStatus }[];
};

export type UserControlDrawerState = {
  roleId: string;
  tab: "perms" | "members";
  query: string;
  draft: Set<number>;
  touched: boolean;
};

type ConfirmState =
  | { kind: "delete"; role: TApplicationRole }
  | { kind: "discard" }
  | null;

type StepResult =
  | { ok: true; data?: unknown }
  | { ok: false; forbidden: boolean; message: string };

const useDebouncedValue = (value: string) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), 300);
    return () => window.clearTimeout(timeout);
  }, [value]);

  return debounced;
};

const withUserRole = (
  source: Map<string, Set<string>>,
  userId: string,
  roleId: string,
  assigned: boolean,
) => {
  const next = new Map(source);
  const roles = new Set(next.get(userId) ?? []);
  if (assigned) roles.add(roleId);
  else roles.delete(roleId);
  next.set(userId, roles);
  return next;
};

export const useUserControl = () => {
  const { t } = useTranslation();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "company" | "shared">("all");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [drawer, setDrawer] = useState<UserControlDrawerState | null>(null);
  const debouncedEmployeeSearch = useDebouncedValue(employeeSearch.trim());
  const debouncedRoleSearch = useDebouncedValue(roleSearch.trim());
  const debouncedPermissionSearch = useDebouncedValue(permissionSearch.trim());
  const debouncedProjectSearch = useDebouncedValue(projectSearch.trim());
  const debouncedDrawerPermissionSearch = useDebouncedValue(
    (drawer?.query ?? "").trim(),
  );
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

  const recruitMutation = useRecruitEmployee();
  const setUserRolesMutation = useSetUserRoles();
  const setUserProjectsMutation = useSetUserProjects();
  const createRoleMutation = useCreateApplicationRole();
  const editRoleMutation = useEditApplicationRole();
  const deleteRoleMutation = useDeleteApplicationRole();
  const setPermissionsMutation = useSetApplicationRolePermissions();
  const assignMutation = useAssignApplicationRole();
  const unassignMutation = useUnassignApplicationRole();

  const [userRoleOverride, setUserRoleOverride] = useState<Map<
    string,
    Set<string>
  > | null>(null);
  const [rolePermOverride, setRolePermOverride] = useState<Map<
    string,
    Set<number>
  > | null>(null);
  const userRoleWrites = useRef(0);
  const rolePermWrites = useRef(0);

  const [inviteRoleIds, setInviteRoleIds] = useState<Set<string>>(new Set());
  const [inviteProjectIds, setInviteProjectIds] = useState<Set<number>>(
    new Set(),
  );
  const [inviteRun, setInviteRun] = useState<InviteRunState | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const inviteForm = useForm<InviteEmployeeValues>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: { employeeEmail: "" },
    mode: "onChange",
  });
  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: "", description: "" },
  });

  const userRoles = userRoleOverride ?? data.userRoles;
  const rolePerms = rolePermOverride ?? data.rolePerms;

  useEffect(() => {
    if (userRoleWrites.current === 0) setUserRoleOverride(null);
  }, [data.userRolesKey]);

  useEffect(() => {
    if (rolePermWrites.current === 0) setRolePermOverride(null);
  }, [data.rolePermsKey]);

  const activeInviteRoleIds = useMemo(() => {
    if (data.isInitialLoading) return inviteRoleIds;
    const known = new Set(data.roles.map((role) => role.id));
    return new Set([...inviteRoleIds].filter((roleId) => known.has(roleId)));
  }, [data.isInitialLoading, data.roles, inviteRoleIds]);

  const activeInviteProjectIds = useMemo(() => {
    if (data.projectsStatus !== "ready") return inviteProjectIds;
    const known = new Set(data.projects.map((project) => project.id));
    return new Set(
      [...inviteProjectIds].filter((projectId) => known.has(projectId)),
    );
  }, [data.projects, data.projectsStatus, inviteProjectIds]);

  const drawerDraft = useMemo(() => {
    if (!drawer) return new Set<number>();
    if (drawer.touched) return drawer.draft;
    return rolePerms.get(drawer.roleId) ?? drawer.draft;
  }, [drawer, rolePerms]);

  const reload = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: applicationRoleQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: employeeQueryRootKey }),
      queryClient.invalidateQueries({ queryKey: projectEmployeeQueryRootKey }),
    ]);
  };

  const emailValid = inviteForm.formState.isValid;

  const invitePreview = useMemo(() => {
    const permissionIds = new Set<number>();
    activeInviteRoleIds.forEach((roleId) => {
      rolePerms.get(roleId)?.forEach((permissionId) => {
        permissionIds.add(permissionId);
      });
    });
    const groupCount = data.groups.filter((group) =>
      group.actions.some((action) => permissionIds.has(action.id)),
    ).length;

    return {
      hasRoles: activeInviteRoleIds.size > 0,
      permissionCount: permissionIds.size,
      groupCount,
      projectCount: activeInviteProjectIds.size,
    };
  }, [activeInviteProjectIds.size, activeInviteRoleIds, data.groups, rolePerms]);

  const toggleInviteRole = (roleId: string, force?: boolean) => {
    setInviteRoleIds((current) => {
      const next = new Set(current);
      const enabled = force ?? !next.has(roleId);
      if (enabled) next.add(roleId);
      else next.delete(roleId);
      return next;
    });
  };

  const toggleInviteProject = (projectId: number) => {
    setInviteProjectIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  };

  const runStep = async (
    action: () => Promise<{ isSuccess: boolean; message: string; data?: unknown }>,
  ): Promise<StepResult> => {
    try {
      const response = await action();
      if (!response.isSuccess) {
        return {
          ok: false,
          forbidden: false,
          message: response.message || t("common.unexpectedError"),
        };
      }
      return { ok: true, data: response.data };
    } catch (error) {
      return {
        ok: false,
        forbidden: isForbiddenError(error),
        message: readApiMessage(error, t("common.unexpectedError")),
      };
    }
  };

  const submitInvite = inviteForm.handleSubmit(async (values) => {
    const email = values.employeeEmail.trim();
    const roleIds = [...activeInviteRoleIds];
    const projectIds = [...activeInviteProjectIds];
    const roleNames = roleIds
      .map((roleId) => data.roleCatalog.get(roleId)?.name)
      .filter((name): name is string => Boolean(name));
    const projectNames = projectIds
      .map((projectId) => data.projectCatalog.get(projectId)?.name)
      .filter((name): name is string => Boolean(name));
    const assignRoles = canSetUserRoles && !data.rolesFailed && roleIds.length > 0;
    const assignProjects =
      canSetProjects && data.projectsStatus !== "error" && projectIds.length > 0;
    const warnRoles = !assignRoles && (!canSetUserRoles || data.rolesFailed);
    const warnProjects =
      !assignProjects && (!canSetProjects || data.projectsStatus === "error");

    const steps: InviteRunState["steps"] = [
      { title: t("userControl.invite.recruit"), detail: email, status: "wait" },
      {
        title: t("userControl.invite.assignRoles"),
        detail: assignRoles
          ? roleNames.join(", ")
          : warnRoles
            ? t("userControl.invite.rolesForbidden")
            : t("userControl.invite.noRolesSelected"),
        status: assignRoles ? "wait" : warnRoles ? "warn" : "skip",
      },
      {
        title: t("userControl.invite.grantProjects"),
        detail: assignProjects
          ? projectNames.join(", ")
          : warnProjects
            ? t("userControl.invite.projectsForbidden")
            : t("userControl.invite.noProjectsSelected"),
        status: assignProjects ? "wait" : warnProjects ? "warn" : "skip",
      },
    ];

    const publish = (
      title: string,
      subtitle: string,
      closable = false,
    ) => {
      setInviteRun({
        title,
        subtitle,
        closable,
        steps: steps.map((step) => ({ ...step })),
      });
    };

    publish(t("userControl.invite.inviting", { email }), t("userControl.invite.note"));
    steps[0].status = "run";
    publish(t("userControl.invite.inviting", { email }), t("userControl.invite.note"));

    const recruited = await runStep(() =>
      recruitMutation.mutateAsync({ employeeEmail: email }),
    );

    if (!recruited.ok) {
      steps[0].status = "fail";
      steps[0].detail = recruited.message;
      steps[1].status = "skip";
      steps[1].detail = t("userControl.invite.skipped");
      steps[2].status = "skip";
      steps[2].detail = t("userControl.invite.skipped");
      publish(
        t("userControl.invite.failedTitle"),
        t("userControl.invite.failedSubtitle"),
        true,
      );
      return;
    }

    const userId = recruited.data;
    if (typeof userId !== "string" || userId.length === 0) {
      steps[0].status = "fail";
      steps[0].detail = t("userControl.invite.missingUserId");
      steps[1].status = "skip";
      steps[2].status = "skip";
      publish(
        t("userControl.invite.failedTitle"),
        t("userControl.invite.missingUserId"),
        true,
      );
      return;
    }

    steps[0].status = "ok";

    if (assignRoles) {
      steps[1].status = "run";
      publish(t("userControl.invite.inviting", { email }), t("userControl.invite.note"));
      const assigned = await runStep(() =>
        setUserRolesMutation.mutateAsync({ userId, roleIds }),
      );
      steps[1].status = assigned.ok ? "ok" : assigned.forbidden ? "warn" : "fail";
      if (!assigned.ok) steps[1].detail = assigned.message;
    }

    if (assignProjects) {
      steps[2].status = "run";
      publish(t("userControl.invite.inviting", { email }), t("userControl.invite.note"));
      const granted = await runStep(() =>
        setUserProjectsMutation.mutateAsync({ userId, projectIds }),
      );
      steps[2].status = granted.ok ? "ok" : granted.forbidden ? "warn" : "fail";
      if (!granted.ok) steps[2].detail = granted.message;
    }

    const failed = steps.some((step) => step.status === "fail" || step.status === "warn");
    const hasRole = steps[1].status === "ok";
    publish(
      failed
        ? t("userControl.invite.problemsTitle")
        : t("userControl.invite.successTitle"),
      failed
        ? t("userControl.invite.problemsSubtitle")
        : hasRole
          ? t("userControl.invite.successSubtitle")
          : t("userControl.invite.noRoleYet"),
      true,
    );

    inviteForm.reset({ employeeEmail: "" });
    setInviteRoleIds(new Set());
    setInviteProjectIds(new Set());
    await reload();
  });

  const openCreateRole = () => {
    if (!canCreateRole) return;
    setEditingRoleId(null);
    roleForm.reset({ name: "", description: "" });
    setRoleModalOpen(true);
  };

  const openEditRole = (roleId: string) => {
    const role = data.roleCatalog.get(roleId);
    if (!role || role.isShared || !canEditRole) return;
    setEditingRoleId(roleId);
    roleForm.reset({ name: role.name, description: role.description ?? "" });
    setRoleModalOpen(true);
  };

  const submitRole = roleForm.handleSubmit(async (values) => {
    const name = values.name.trim();
    const description = values.description.trim();

    if (editingRoleId) {
      const response = await editRoleMutation.mutateAsync({
        id: editingRoleId,
        name,
        description,
      });
      if (!response.isSuccess) return;
      toast.success(response.message || t("userControl.toast.roleUpdated"));
      setRoleModalOpen(false);
      await reload();
      return;
    }

    const response = await createRoleMutation.mutateAsync({ name, description });
    if (!response.isSuccess) return;
    toast.success(
      response.message || t("userControl.toast.roleCreated", { name }),
    );
    setRoleModalOpen(false);
    await reload();
    if (typeof response.data === "string" && response.data) {
      setDrawer({
        roleId: response.data,
        tab: "perms",
        query: "",
        draft: new Set(),
        touched: false,
      });
    }
  });

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
    setInviteRoleIds((current) => {
      const next = new Set(current);
      next.delete(role.id);
      return next;
    });
    setDrawer((current) => (current?.roleId === role.id ? null : current));
    setConfirmState(null);
    await reload();
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
      const response = await setPermissionsMutation.mutateAsync({
        roleId,
        permissionIds: unique,
      });
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

  const drawerRole = drawer
    ? data.roleCatalog.get(drawer.roleId) ?? null
    : null;
  const drawerDirty = Boolean(
    drawer?.touched &&
      !setsEqual(rolePerms.get(drawer.roleId) ?? new Set<number>(), drawerDraft),
  );
  const editingRole = editingRoleId
    ? data.roleCatalog.get(editingRoleId) ?? null
    : null;

  const isBusy =
    data.isFetching ||
    recruitMutation.isPending ||
    setUserRolesMutation.isPending ||
    setUserProjectsMutation.isPending ||
    createRoleMutation.isPending ||
    editRoleMutation.isPending ||
    deleteRoleMutation.isPending ||
    setPermissionsMutation.isPending ||
    assignMutation.isPending ||
    unassignMutation.isPending;

  return {
    ...data,
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
    invitePending:
      recruitMutation.isPending ||
      setUserRolesMutation.isPending ||
      setUserProjectsMutation.isPending,
    inviteForm,
    emailValid,
    inviteRoleIds: activeInviteRoleIds,
    inviteProjectIds: activeInviteProjectIds,
    invitePreview,
    toggleInviteRole,
    toggleInviteProject,
    submitInvite,
    inviteRun,
    closeInviteRun: () => setInviteRun(null),
    roleForm,
    roleModalOpen,
    editingRole,
    openCreateRole,
    openEditRole,
    closeRoleModal: () => setRoleModalOpen(false),
    submitRole,
    roleSaving: createRoleMutation.isPending || editRoleMutation.isPending,
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
