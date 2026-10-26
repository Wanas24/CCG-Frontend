import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { useGetActiveEntityApprovalRequest } from "@/modules/approval/api/hooks/useGetActiveEntityApprovalRequest";
import { useForceDecideApprovalRequest } from "@/modules/approval/api/hooks/useForceDecideApprovalRequest";
import { useGetApprovalEntityTypes } from "@/modules/approval/api/hooks/useGetApprovalEntityTypes";
import { useGetEntityApprovalRequests } from "@/modules/approval/api/hooks/useGetEntityApprovalRequests";
import {
  approvalActiveEntityRequestQueryKey,
  approvalEntityRequestsQueryKey,
  approvalPendingRequestsQueryKey,
} from "@/modules/approval/api/queryKeys/approvalWorkflowQueryKeys";
import { myApprovalRequestsRootKey } from "@/modules/approval/api/queryKeys/myApprovalRequestsQueryKeys";
import {
  ApprovalDecision,
  type TApprovalDecision,
  type TApprovalPendingRequest,
} from "@/modules/approval/types";
import { extractEntityApprovalRequests } from "@/modules/approval/utils/extractEntityApprovalRequests";
import { isActionableApprovalRequest } from "@/modules/approval/utils/isActionableApprovalRequest";
import { resolveProjectApprovalEntityType } from "@/modules/approval/utils/resolveProjectApprovalEntityType";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import type { TProject } from "../types/project";

const ENTITY_REQUESTS_TAKE = 50;

export type ProjectApprovalDecideState = {
  decision: TApprovalDecision;
  request: TApprovalPendingRequest;
};

export const useProjectApprovalsManager = (project: TProject) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();

  const canGetEntityTypes = hasPermission(PermissionsList.ApprovalWorkflow.Get);
  const canGetEntityRequests = hasPermission(
    PermissionsList.ApprovalWorkflow.GetEntityRequests,
  );
  const canGetActiveEntityRequest = hasPermission(
    PermissionsList.ApprovalWorkflow.GetActiveEntityRequest,
  );
  const canForceDecide = hasPermission(
    PermissionsList.ApprovalWorkflow.ForceDecide,
  );

  const [decideState, setDecideState] =
    useState<ProjectApprovalDecideState | null>(null);
  const [comment, setComment] = useState("");

  const entityTypesQuery = useGetApprovalEntityTypes(canGetEntityTypes);
  const entityTypes = useMemo(() => {
    const data = entityTypesQuery.data?.isSuccess
      ? entityTypesQuery.data.data
      : null;
    return Array.isArray(data) ? data : [];
  }, [entityTypesQuery.data]);

  const entityTypesReady =
    !canGetEntityTypes || entityTypesQuery.isFetched || entityTypesQuery.isError;

  const resolvedEntityType = useMemo(() => {
    if (!entityTypesReady) return null;

    const fromCatalog = resolveProjectApprovalEntityType(entityTypes);
    if (fromCatalog) return fromCatalog;

    if (canGetEntityTypes && entityTypesQuery.isSuccess && entityTypes.length) {
      return null;
    }

    return canGetEntityRequests ? "Project" : null;
  }, [
    canGetEntityRequests,
    canGetEntityTypes,
    entityTypes,
    entityTypesQuery.isSuccess,
    entityTypesReady,
  ]);

  const entityId = String(project.id);
  const listParams =
    resolvedEntityType != null
      ? {
          entityType: resolvedEntityType,
          entityId,
          take: ENTITY_REQUESTS_TAKE,
        }
      : null;

  const requestsQuery = useGetEntityApprovalRequests(
    listParams,
    canGetEntityRequests && listParams != null,
  );
  const activeQuery = useGetActiveEntityApprovalRequest(
    listParams
      ? { entityType: listParams.entityType, entityId: listParams.entityId }
      : null,
    canGetActiveEntityRequest && listParams != null,
  );

  const decideMutation = useForceDecideApprovalRequest();

  const requests = useMemo(
    () => extractEntityApprovalRequests(requestsQuery.data),
    [requestsQuery.data],
  );

  const actionableRequests = useMemo(
    () => requests.filter(isActionableApprovalRequest),
    [requests],
  );

  const historyRequests = useMemo(
    () => requests.filter((request) => !isActionableApprovalRequest(request)),
    [requests],
  );

  const activeRequest = useMemo(() => {
    if (!activeQuery.data?.isSuccess) return null;
    const data = activeQuery.data.data;
    if (!data || typeof data !== "object") return null;
    return data as TApprovalPendingRequest;
  }, [activeQuery.data]);

  const activeRequestId = activeRequest?.requestId ?? null;

  const refreshProjectApprovals = async () => {
    const tasks: Promise<unknown>[] = [];

    if (listParams) {
      tasks.push(
        queryClient.invalidateQueries({
          queryKey: approvalEntityRequestsQueryKey(
            listParams.entityType,
            listParams.entityId,
            listParams.take,
          ),
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: approvalActiveEntityRequestQueryKey(
            listParams.entityType,
            listParams.entityId,
          ),
          refetchType: "active",
        }),
      );
    }

    tasks.push(
      queryClient.invalidateQueries({
        queryKey: approvalPendingRequestsQueryKey,
        refetchType: "all",
      }),
      queryClient.invalidateQueries({
        queryKey: myApprovalRequestsRootKey,
        refetchType: "active",
      }),
    );

    await Promise.all(tasks);
  };

  const openDecide = (
    request: TApprovalPendingRequest,
    decision: TApprovalDecision,
  ) => {
    if (
      !canForceDecide ||
      decideMutation.isPending ||
      !isActionableApprovalRequest(request)
    ) {
      return;
    }
    setComment("");
    setDecideState({ request, decision });
  };

  const closeDecide = () => {
    if (decideMutation.isPending) return;
    setDecideState(null);
    setComment("");
  };

  const confirmDecide = async () => {
    if (!decideState || !canForceDecide || decideMutation.isPending) return;

    try {
      const response = await decideMutation.mutateAsync({
        requestId: decideState.request.requestId,
        decision: decideState.decision,
        comment: comment.trim() || undefined,
      });

      if (!response.isSuccess) {
        toast.error(
          response.message || t("projects.approvals.decisionFailed"),
        );
        return;
      }

      toast.success(
        response.message ||
          (decideState.decision === ApprovalDecision.Approve
            ? t("projects.approvals.decisionApproved")
            : t("projects.approvals.decisionDeclined")),
      );
      setDecideState(null);
      setComment("");
      await refreshProjectApprovals();
    } catch {
      toast.error(t("projects.approvals.decisionFailed"));
    }
  };

  const isEntityTypeMissing =
    canGetEntityRequests &&
    canGetEntityTypes &&
    entityTypesQuery.isSuccess &&
    resolvedEntityType == null;

  return {
    canGetEntityRequests,
    canGetActiveEntityRequest,
    canForceDecide,
    canGetEntityTypes,
    resolvedEntityType,
    entityId,
    requests,
    actionableRequests,
    historyRequests,
    requestsQuery,
    activeRequestId,
    activeQuery,
    entityTypesQuery,
    isEntityTypeMissing,
    decideState,
    comment,
    setComment,
    isDeciding: decideMutation.isPending,
    openDecide,
    closeDecide,
    confirmDecide,
    refreshProjectApprovals,
  };
};
