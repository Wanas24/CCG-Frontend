import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useRecruitEmployee } from "../api/hooks/useRecruitEmployee";
import { useSetUserProjects } from "../api/hooks/useSetUserProjects";
import { useSetUserRoles } from "../api/hooks/useSetUserRoles";
import { inviteEmployeeSchema, type InviteEmployeeValues } from "../schemas";
import type {
  TApplicationRole,
  TApplicationRolePermissionGroup,
  TProjectWithUsers,
} from "../types";
import type { InviteRunState } from "../types";
import { isForbiddenError, readApiMessage } from "../utils/readApiMessage";

type InviteSnapshot = {
  isInitialLoading: boolean;
  roles: TApplicationRole[];
  projectsStatus: "loading" | "ready" | "error";
  projects: TProjectWithUsers[];
  groups: TApplicationRolePermissionGroup[];
  rolesFailed: boolean;
  roleCatalog: Map<string, TApplicationRole>;
  projectCatalog: Map<number, TProjectWithUsers>;
};

type StepResult =
  | { ok: true; data?: unknown }
  | { ok: false; forbidden: boolean; message: string };

type Params = {
  data: InviteSnapshot;
  rolePerms: Map<string, Set<number>>;
  canRecruit: boolean;
  canSetUserRoles: boolean;
  canSetProjects: boolean;
  reload: () => Promise<void>;
};

export const useUserControlInvite = ({
  data,
  rolePerms,
  canSetUserRoles,
  canSetProjects,
  reload,
}: Params) => {
  const { t } = useTranslation();
  const [inviteRoleIds, setInviteRoleIds] = useState<Set<string>>(new Set());
  const [inviteProjectIds, setInviteProjectIds] = useState<Set<number>>(new Set());
  const [inviteRun, setInviteRun] = useState<InviteRunState | null>(null);

  const recruitMutation = useRecruitEmployee();
  const setUserRolesMutation = useSetUserRoles();
  const setUserProjectsMutation = useSetUserProjects();

  const inviteForm = useForm<InviteEmployeeValues>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: { employeeEmail: "" },
    mode: "onChange",
  });

  const activeInviteRoleIds = useMemo(() => {
    if (data.isInitialLoading) return inviteRoleIds;
    const known = new Set(data.roles.map((role) => role.id));
    return new Set([...inviteRoleIds].filter((roleId) => known.has(roleId)));
  }, [data.isInitialLoading, data.roles, inviteRoleIds]);

  const activeInviteProjectIds = useMemo(() => {
    if (data.projectsStatus !== "ready") return inviteProjectIds;
    const known = new Set(data.projects.map((project) => project.id));
    return new Set([...inviteProjectIds].filter((projectId) => known.has(projectId)));
  }, [data.projects, data.projectsStatus, inviteProjectIds]);

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

  const cleanupRole = (roleId: string) => {
    setInviteRoleIds((current) => {
      if (!current.has(roleId)) return current;
      const next = new Set(current);
      next.delete(roleId);
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

    const publish = (title: string, subtitle: string, closable = false) => {
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

  return {
    inviteForm,
    emailValid: inviteForm.formState.isValid,
    inviteRoleIds: activeInviteRoleIds,
    inviteProjectIds: activeInviteProjectIds,
    invitePreview,
    invitePending:
      recruitMutation.isPending ||
      setUserRolesMutation.isPending ||
      setUserProjectsMutation.isPending,
    toggleInviteRole,
    toggleInviteProject,
    submitInvite,
    inviteRun,
    closeInviteRun: () => setInviteRun(null),
    cleanupRole,
  };
};
