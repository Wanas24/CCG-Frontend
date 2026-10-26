import { callEndpoint } from "@/lib/api/callEndpoint";
import { approvalWorkflowEndpoints } from "../endPoints/approvalWorkflow.endpoints";
import type {
  TApprovalDecision,
  TDeactivateApprovalWorkflowResponse,
  TForceDecideApprovalRequestResponse,
  TGetActiveEntityApprovalRequestParams,
  TGetActiveEntityApprovalRequestResponse,
  TGetApprovalEntityTypesResponse,
  TGetApprovalWorkflowsResponse,
  TGetEntityApprovalRequestsParams,
  TGetEntityApprovalRequestsResponse,
  TGetPendingApprovalRequestsResponse,
  TSaveApprovalWorkflowBody,
  TSaveApprovalWorkflowResponse,
} from "../../types";

export const approvalWorkflowService = {
  getEntityTypes: () =>
    callEndpoint<TGetApprovalEntityTypesResponse>(
      approvalWorkflowEndpoints.entityTypes,
    ),

  getWorkflows: (includeInactive = true) =>
    callEndpoint<TGetApprovalWorkflowsResponse>(
      approvalWorkflowEndpoints.list,
      {
        queryParams: { includeInactive },
      },
    ),

  getPendingRequests: (params?: {
    page?: number;
    pageSize?: number;
    sortDescending?: boolean;
  }) =>
    callEndpoint<TGetPendingApprovalRequestsResponse>(
      approvalWorkflowEndpoints.pendingRequests,
      {
        queryParams: {
          page: params?.page ?? 1,
          pageSize: params?.pageSize ?? 50,
          sortDescending: params?.sortDescending ?? true,
        },
      },
    ),

  getEntityRequests: (params: TGetEntityApprovalRequestsParams) =>
    callEndpoint<TGetEntityApprovalRequestsResponse>(
      approvalWorkflowEndpoints.entityRequests,
      {
        queryParams: {
          entityType: params.entityType,
          entityId: params.entityId,
          take: params.take ?? 50,
        },
      },
    ),

  getActiveEntityRequest: (params: TGetActiveEntityApprovalRequestParams) =>
    callEndpoint<TGetActiveEntityApprovalRequestResponse>(
      approvalWorkflowEndpoints.activeEntityRequest,
      {
        queryParams: {
          entityType: params.entityType,
          entityId: params.entityId,
        },
      },
    ),

  createWorkflow: (body: TSaveApprovalWorkflowBody) =>
    callEndpoint<TSaveApprovalWorkflowResponse, TSaveApprovalWorkflowBody>(
      approvalWorkflowEndpoints.create,
      { body },
    ),

  updateWorkflow: (id: string, body: TSaveApprovalWorkflowBody) =>
    callEndpoint<TSaveApprovalWorkflowResponse, TSaveApprovalWorkflowBody>(
      approvalWorkflowEndpoints.update,
      { pathParams: { id }, body },
    ),

  deactivateWorkflow: (id: string) =>
    callEndpoint<TDeactivateApprovalWorkflowResponse>(
      approvalWorkflowEndpoints.deactivate,
      { pathParams: { id } },
    ),

  forceDecide: (
    requestId: string,
    decision: TApprovalDecision,
    comment?: string,
  ) =>
    callEndpoint<TForceDecideApprovalRequestResponse>(
      approvalWorkflowEndpoints.forceDecide,
      {
        pathParams: { requestId },
        queryParams: {
          decision,
          ...(comment ? { comment } : {}),
        },
      },
    ),
};
