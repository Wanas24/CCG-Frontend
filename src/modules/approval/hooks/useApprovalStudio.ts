import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { useGetEmployees } from "@/modules/userControl/api/hooks/useGetEmployees";
import { useGetApplicationRoles } from "@/modules/userControl/api/hooks/useGetApplicationRoles";
import { useGetApprovalEntityTypes } from "../api/hooks/useGetApprovalEntityTypes";
import { useGetApprovalWorkflows } from "../api/hooks/useGetApprovalWorkflows";
import { useGetPendingApprovalRequests } from "../api/hooks/useGetPendingApprovalRequests";
import { useCreateApprovalWorkflow } from "../api/hooks/useCreateApprovalWorkflow";
import { useUpdateApprovalWorkflow } from "../api/hooks/useUpdateApprovalWorkflow";
import { useDeactivateApprovalWorkflow } from "../api/hooks/useDeactivateApprovalWorkflow";
import { useForceDecideApprovalRequest } from "../api/hooks/useForceDecideApprovalRequest";
import { approvalQueryRootKey } from "../api/queryKeys/approvalWorkflowQueryKeys";
import {
  ApprovalActionScope,
  ApprovalApproverType,
  ApprovalDecision,
  ApprovalRequirementMode,
  type TApprovalActionScope,
  type TApprovalPendingRequest,
  type TApprovalWorkflow,
  type TApprovalWorkflowCommand,
} from "../types";

export type ApprovalStudioViewMode = "workflows" | "coverage";

export type ApprovalBuilderGroupDraft = {
  key: string;
  approverType: number;
  approverKey: string;
  requirementMode: number;
  minApprovals: number;
  canSkipLowerLevels: boolean;
};

export type ApprovalBuilderLevelDraft = {
  key: string;
  name: string;
  groups: ApprovalBuilderGroupDraft[];
};

export type ApprovalBuilderDraft = {
  id: string | null;
  name: string;
  entityType: string;
  actionScope: TApprovalActionScope;
  isActive: boolean;
  levels: ApprovalBuilderLevelDraft[];
  showErrors: boolean;
};

const newKey = () => Math.random().toString(36).slice(2, 10);

export const createEmptyApproverGroup = (): ApprovalBuilderGroupDraft => ({
  key: newKey(),
  approverType: ApprovalApproverType.Role,
  approverKey: "",
  requirementMode: ApprovalRequirementMode.Any,
  minApprovals: 1,
  canSkipLowerLevels: false,
});

export const createEmptyApprovalLevel = (): ApprovalBuilderLevelDraft => ({
  key: newKey(),
  name: "",
  groups: [],
});

const workflowToDraft = (
  workflow: TApprovalWorkflow,
  asCopy = false,
): ApprovalBuilderDraft => ({
  id: asCopy ? null : workflow.id,
  name: asCopy ? `${workflow.name} (copy)` : workflow.name,
  entityType: workflow.entityType,
  actionScope: workflow.actionScope,
  isActive: asCopy ? true : workflow.isActive,
  showErrors: false,
  levels: [...workflow.levels]
    .sort((a, b) => a.levelOrder - b.levelOrder)
    .map((level) => ({
      key: newKey(),
      name: level.name,
      groups: level.groups.map((group) => ({
        key: newKey(),
        approverType: group.approverType,
        approverKey: group.approverKey,
        requirementMode: group.requirementMode,
        minApprovals: group.minApprovals,
        canSkipLowerLevels: group.canSkipLowerLevels,
      })),
    })),
});

const blankDraft = (entityType = ""): ApprovalBuilderDraft => ({
  id: null,
  name: "",
  entityType,
  actionScope: ApprovalActionScope.All,
  isActive: true,
  showErrors: false,
  levels: [createEmptyApprovalLevel()],
});

export const useApprovalStudio = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { hasPermission, isAdmin, isManager, isLoading: permissionsLoading } =
    usePermissions();

  const can = (permission: string) =>
    !permissionsLoading &&
    (isAdmin || isManager || hasPermission(permission));

  const canGet = can(PermissionsList.ApprovalWorkflow.Get);
  const canCreate = can(PermissionsList.ApprovalWorkflow.Create);
  const canUpdate = can(PermissionsList.ApprovalWorkflow.Update);
  const canDeactivate = can(PermissionsList.ApprovalWorkflow.Deactivate);
  const canGetPending = can(PermissionsList.ApprovalWorkflow.GetPendingRequests);
  const canForceDecide = can(PermissionsList.ApprovalWorkflow.ForceDecide);
  const canGetEmployees = can(PermissionsList.Employee.Get);
  const canGetRoles = can(PermissionsList.ApplicationRole.Get);

  const [view, setView] = useState<ApprovalStudioViewMode>("workflows");
  const [query, setQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [entityKey, setEntityKey] = useState("all");
  const [lockedOnly, setLockedOnly] = useState(false);
  const [builder, setBuilder] = useState<ApprovalBuilderDraft | null>(null);
  const [requestsWorkflowId, setRequestsWorkflowId] = useState<string | null>(
    null,
  );
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [decideState, setDecideState] = useState<{
    decision: typeof ApprovalDecision.Approve | typeof ApprovalDecision.Decline;
    requestIds: string[];
  } | null>(null);

  const entityTypesQuery = useGetApprovalEntityTypes(canGet);
  const workflowsQuery = useGetApprovalWorkflows(true, canGet);
  const pendingQuery = useGetPendingApprovalRequests(canGetPending);
  const employeesQuery = useGetEmployees(
    { pageSize: 200, isFired: false },
    canGetEmployees,
  );
  const rolesQuery = useGetApplicationRoles({ pageSize: 200 }, canGetRoles);

  const createMutation = useCreateApprovalWorkflow();
  const updateMutation = useUpdateApprovalWorkflow();
  const deactivateMutation = useDeactivateApprovalWorkflow();
  const decideMutation = useForceDecideApprovalRequest();

  const entityTypes = useMemo(
    () =>
      entityTypesQuery.data?.isSuccess &&
      Array.isArray(entityTypesQuery.data.data)
        ? entityTypesQuery.data.data
        : [],
    [entityTypesQuery.data],
  );

  const workflows = useMemo(
    () =>
      workflowsQuery.data?.isSuccess && Array.isArray(workflowsQuery.data.data)
        ? workflowsQuery.data.data
        : [],
    [workflowsQuery.data],
  );

  const pending = useMemo(() => {
    if (!canGetPending) return null;
    if (
      pendingQuery.data?.isSuccess &&
      pendingQuery.data.data?.data
    ) {
      return pendingQuery.data.data.data;
    }
    return [];
  }, [canGetPending, pendingQuery.data]);

  const employees = useMemo(
    () =>
      canGetEmployees
        ? (employeesQuery.data?.pages.flatMap((page) =>
            page.isSuccess && page.data?.data ? page.data.data : [],
          ) ?? [])
        : null,
    [canGetEmployees, employeesQuery.data],
  );

  const roles = useMemo(
    () =>
      canGetRoles
        ? (rolesQuery.data?.pages.flatMap((page) =>
            page.isSuccess && page.data?.data ? page.data.data : [],
          ) ?? [])
        : null,
    [canGetRoles, rolesQuery.data],
  );

  const pendingByWorkflow = useMemo(() => {
    const map = new Map<string, TApprovalPendingRequest[]>();
    if (!pending) return map;
    for (const request of pending) {
      const list = map.get(request.workflowId) ?? [];
      list.push(request);
      map.set(request.workflowId, list);
    }
    return map;
  }, [pending]);

  const lockedWorkflowIds = useMemo(
    () => new Set([...pendingByWorkflow.keys()]),
    [pendingByWorkflow],
  );

  const filteredWorkflows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workflows
      .filter((workflow) => showInactive || workflow.isActive)
      .filter((workflow) =>
        entityKey === "all" ? true : workflow.entityType === entityKey,
      )
      .filter((workflow) =>
        lockedOnly ? lockedWorkflowIds.has(workflow.id) : true,
      )
      .filter((workflow) => {
        if (!q) return true;
        const entityLabel =
          entityTypes.find((item) => item.key === workflow.entityType)?.value ??
          workflow.entityType;
        const haystack = [
          workflow.name,
          entityLabel,
          String(workflow.actionScope),
          ...workflow.levels.flatMap((level) => [
            level.name,
            ...level.groups.map((group) => group.approverKey),
          ]),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort(
        (a, b) =>
          Number(b.isActive) - Number(a.isActive) ||
          a.entityType.localeCompare(b.entityType) ||
          a.actionScope - b.actionScope,
      );
  }, [
    entityKey,
    entityTypes,
    lockedOnly,
    lockedWorkflowIds,
    query,
    showInactive,
    workflows,
  ]);

  const stats = useMemo(() => {
    const active = workflows.filter((workflow) => workflow.isActive);
    const coveredEntities = new Set(
      active.map((workflow) => workflow.entityType),
    ).size;
    const groupCount = active.reduce(
      (sum, workflow) =>
        sum +
        workflow.levels.reduce(
          (levelSum, level) => levelSum + level.groups.length,
          0,
        ),
      0,
    );
    return {
      activeCount: active.length,
      coverageCount: coveredEntities,
      entityTypeCount: entityTypes.length,
      pendingCount: pending?.length ?? 0,
      lockedCount: lockedWorkflowIds.size,
      groupCount,
    };
  }, [entityTypes.length, lockedWorkflowIds.size, pending, workflows]);

  const openBuilder = (draft: ApprovalBuilderDraft) => setBuilder(draft);
  const closeBuilder = () => setBuilder(null);

  const openNew = (entityType?: string, scope?: TApprovalActionScope) => {
    if (!canCreate) return;
    const draft = blankDraft(
      entityType ?? (entityKey !== "all" ? entityKey : ""),
    );
    if (scope !== undefined) draft.actionScope = scope;
    openBuilder(draft);
  };

  const openEdit = (workflowId: string) => {
    const workflow = workflows.find((item) => item.id === workflowId);
    if (!workflow) return;
    if (lockedWorkflowIds.has(workflow.id)) {
      if (canGetPending) setRequestsWorkflowId(workflow.id);
      return;
    }
    if (!canUpdate) return;
    openBuilder(workflowToDraft(workflow));
  };

  const openCopy = (workflowId: string) => {
    if (!canCreate) return;
    const workflow = workflows.find((item) => item.id === workflowId);
    if (!workflow) return;
    openBuilder(workflowToDraft(workflow, true));
  };

  const draftToCommand = (
    draft: ApprovalBuilderDraft,
  ): TApprovalWorkflowCommand => ({
    entityType: draft.entityType,
    actionScope: draft.actionScope,
    name: draft.name.trim(),
    isActive: draft.isActive,
    levels: draft.levels.map((level, index) => ({
      levelOrder: index + 1,
      name: level.name.trim(),
      groups: level.groups.map((group) => ({
        approverType: group.approverType as 0 | 1,
        approverKey: group.approverKey,
        requirementMode: group.requirementMode as 0 | 1,
        minApprovals:
          group.approverType === ApprovalApproverType.User ||
          group.requirementMode === ApprovalRequirementMode.All
            ? 1
            : group.minApprovals,
        canSkipLowerLevels: index > 0 && group.canSkipLowerLevels,
      })),
    })),
  });

  const validateDraft = (draft: ApprovalBuilderDraft) => {
    const errors: string[] = [];
    if (!draft.name.trim()) errors.push(t("approval.validation.nameRequired"));
    if (!draft.entityType.trim())
      errors.push(t("approval.validation.entityRequired"));
    if (!draft.levels.length)
      errors.push(t("approval.validation.levelsRequired"));
    draft.levels.forEach((level, index) => {
      if (!level.name.trim()) {
        errors.push(
          t("approval.validation.levelNameRequired", { index: index + 1 }),
        );
      }
      if (!level.groups.length) {
        errors.push(
          t("approval.validation.groupRequired", { index: index + 1 }),
        );
      }
      level.groups.forEach((group) => {
        if (!group.approverKey.trim()) {
          errors.push(
            t("approval.validation.approverRequired", { index: index + 1 }),
          );
        }
        if (
          group.requirementMode === ApprovalRequirementMode.Any &&
          group.minApprovals < 1
        ) {
          errors.push(t("approval.validation.minApprovals"));
        }
      });
    });
    return errors;
  };

  const saveBuilder = async () => {
    if (!builder) return false;
    if (builder.id ? !canUpdate : !canCreate) return false;
    const errors = validateDraft(builder);
    if (errors.length) {
      setBuilder({ ...builder, showErrors: true });
      return false;
    }
    const body = draftToCommand(builder);
    if (builder.id) {
      await updateMutation.mutateAsync({ id: builder.id, body });
    } else {
      await createMutation.mutateAsync(body);
    }
    closeBuilder();
    return true;
  };

  const requestsForOpen =
    requestsWorkflowId && pending
      ? pending.filter((request) => request.workflowId === requestsWorkflowId)
      : [];

  return {
    view,
    setView,
    query,
    setQuery,
    showInactive,
    setShowInactive,
    entityKey,
    setEntityKey,
    lockedOnly,
    setLockedOnly,
    builder,
    setBuilder,
    requestsWorkflowId,
    setRequestsWorkflowId,
    selectedRequestIds,
    setSelectedRequestIds,
    decideState,
    setDecideState,
    canGet,
    canCreate,
    canUpdate,
    canDeactivate,
    canGetPending,
    canForceDecide,
    entityTypes,
    workflows,
    filteredWorkflows,
    pending,
    pendingByWorkflow,
    lockedWorkflowIds,
    employees,
    roles,
    stats,
    isLoading:
      entityTypesQuery.isPending ||
      workflowsQuery.isPending ||
      (canGetPending && pendingQuery.isPending),
    isError:
      entityTypesQuery.isError ||
      workflowsQuery.isError ||
      (entityTypesQuery.data !== undefined &&
        !entityTypesQuery.data.isSuccess) ||
      (workflowsQuery.data !== undefined && !workflowsQuery.data.isSuccess),
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending ||
      deactivateMutation.isPending,
    isDeciding: decideMutation.isPending,
    openNew,
    openEdit,
    openCopy,
    closeBuilder,
    openRequests: (workflowId: string) => {
      if (!canGetPending) return;
      setRequestsWorkflowId(workflowId);
      setSelectedRequestIds(new Set());
    },
    closeRequests: () => {
      setRequestsWorkflowId(null);
      setSelectedRequestIds(new Set());
    },
    saveBuilder,
    validateDraft,
    deactivate: async (id: string) => {
      if (!canDeactivate) return;
      await deactivateMutation.mutateAsync(id);
    },
    reactivate: async (workflow: TApprovalWorkflow) => {
      if (!canUpdate) return;
      await updateMutation.mutateAsync({
        id: workflow.id,
        body: {
          entityType: workflow.entityType,
          actionScope: workflow.actionScope,
          name: workflow.name,
          isActive: true,
          levels: [...workflow.levels]
            .sort((a, b) => a.levelOrder - b.levelOrder)
            .map((level, index) => ({
              levelOrder: index + 1,
              name: level.name,
              groups: level.groups.map((group) => ({
                approverType: group.approverType,
                approverKey: group.approverKey,
                requirementMode: group.requirementMode,
                minApprovals: group.minApprovals,
                canSkipLowerLevels: group.canSkipLowerLevels,
              })),
            })),
        },
      });
    },
    createEmptyApproverGroup,
    createEmptyApprovalLevel,
    requestsForOpen,
    decide: async (comment?: string) => {
      if (!decideState || !canForceDecide) return;
      for (const requestId of decideState.requestIds) {
        await decideMutation.mutateAsync({
          requestId,
          decision: decideState.decision,
          comment,
        });
      }
      setDecideState(null);
      setSelectedRequestIds(new Set());
    },
    reload: async () => {
      await queryClient.invalidateQueries({ queryKey: approvalQueryRootKey });
    },
    entityName: (key: string) =>
      entityTypes.find((item) => item.key === key)?.value ?? key,
  };
};

export type ApprovalStudioApi = ReturnType<typeof useApprovalStudio>;
