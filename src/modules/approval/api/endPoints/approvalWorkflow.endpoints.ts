import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const approvalWorkflowEndpoints = {
  entityTypes: createEndpoint({
    method: "GET",
    path: `/ApprovalWorkflow/entity-types`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.Get],
    skipToast: true,
  }),
  list: createEndpoint({
    method: "GET",
    path: `/ApprovalWorkflow`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.Get],
    skipToast: true,
  }),
  pendingRequests: createEndpoint({
    method: "GET",
    path: `/ApprovalWorkflow/requests/pending`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.GetPendingRequests],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/ApprovalWorkflow`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/ApprovalWorkflow/:id`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.Update],
  }),
  deactivate: createEndpoint({
    method: "DELETE",
    path: `/ApprovalWorkflow/:id`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.Deactivate],
  }),
  forceDecide: createEndpoint({
    method: "POST",
    path: `/ApprovalWorkflow/requests/:requestId/decide`,
    auth: "required",
    permissions: [PermissionsList.ApprovalWorkflow.ForceDecide],
  }),
};
