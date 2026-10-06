import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const approvalStudioPermissions = [
  PermissionsList.ApprovalWorkflow.Get,
  PermissionsList.ApprovalWorkflow.Create,
  PermissionsList.ApprovalWorkflow.Update,
  PermissionsList.ApprovalWorkflow.Deactivate,
  PermissionsList.ApprovalWorkflow.GetPendingRequests,
  PermissionsList.ApprovalWorkflow.ForceDecide,
] as const;

export const approvalReservedPermissions = [
  PermissionsList.ApprovalWorkflow.GetActiveEntityRequest,
  PermissionsList.ApprovalWorkflow.GetEntityRequests,
] as const;

export const approvalMenuPermissions = [
  PermissionsList.ApprovalWorkflow.Get,
] as const;

export const approvalAccessPermissions = [
  ...approvalMenuPermissions,
] as const;

type ApprovalAccessInput = {
  granted: ReadonlySet<string>;
};

export const canAccessApproval = ({ granted }: ApprovalAccessInput) =>
  granted.has(PermissionsList.ApprovalWorkflow.Get);
