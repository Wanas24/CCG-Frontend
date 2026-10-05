import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const approvalAccessPermissions = [
  PermissionsList.ApprovalWorkflow.Get,
  PermissionsList.ApprovalWorkflow.Create,
  PermissionsList.ApprovalWorkflow.Update,
  PermissionsList.ApprovalWorkflow.Deactivate,
  PermissionsList.ApprovalWorkflow.GetPendingRequests,
  PermissionsList.ApprovalWorkflow.ForceDecide,
  PermissionsList.ApprovalWorkflow.GetActiveEntityRequest,
  PermissionsList.ApprovalWorkflow.GetEntityRequests,
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
  granted.has(PermissionsList.ApprovalWorkflow.Get) ||
  approvalAccessPermissions.some((permission) => granted.has(permission));
