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

export const approvalAccessPermissions = [
  ...approvalStudioPermissions,
] as const;

type ApprovalAccessInput = {
  isAdmin: boolean;
  isManager: boolean;
  granted: ReadonlySet<string>;
};

export const canAccessApproval = ({
  isAdmin,
  isManager,
  granted,
}: ApprovalAccessInput) =>
  isAdmin ||
  isManager ||
  granted.has(PermissionsList.ApprovalWorkflow.Get);
