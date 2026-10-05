export const ApprovalActionScope = {
  Create: 0,
  Update: 1,
  Delete: 2,
  All: 99,
} as const;

export type TApprovalActionScope =
  (typeof ApprovalActionScope)[keyof typeof ApprovalActionScope];

export const ApprovalApproverType = {
  User: 0,
  Role: 1,
} as const;

export type TApprovalApproverType =
  (typeof ApprovalApproverType)[keyof typeof ApprovalApproverType];

export const ApprovalRequirementMode = {
  Any: 0,
  All: 1,
} as const;

export type TApprovalRequirementMode =
  (typeof ApprovalRequirementMode)[keyof typeof ApprovalRequirementMode];

export const ApprovalDecision = {
  Approve: 1,
  Decline: 2,
} as const;

export type TApprovalDecision =
  (typeof ApprovalDecision)[keyof typeof ApprovalDecision];

export type TApprovalEntityType = {
  key: string;
  value: string;
};

export type TApprovalApproverGroup = {
  id: string;
  approverType: TApprovalApproverType;
  approverKey: string;
  requirementMode: TApprovalRequirementMode;
  minApprovals: number;
  canSkipLowerLevels: boolean;
};

export type TApprovalLevel = {
  id: string;
  levelOrder: number;
  name: string;
  groups: TApprovalApproverGroup[];
};

export type TApprovalWorkflow = {
  id: string;
  companyId: number;
  entityType: string;
  actionScope: TApprovalActionScope;
  name: string;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  levels: TApprovalLevel[];
};

export type TApprovalApproverGroupCommand = {
  approverType: TApprovalApproverType;
  approverKey: string;
  requirementMode: TApprovalRequirementMode;
  minApprovals: number;
  canSkipLowerLevels: boolean;
};

export type TApprovalLevelCommand = {
  levelOrder: number;
  name: string;
  groups: TApprovalApproverGroupCommand[];
};

export type TApprovalWorkflowCommand = {
  entityType: string;
  actionScope: TApprovalActionScope;
  name: string;
  isActive: boolean;
  levels: TApprovalLevelCommand[];
};

export type TApprovalRequestGroupStatus = {
  groupId: string;
  approverType: TApprovalApproverType;
  approverKey: string;
  requirementMode: TApprovalRequirementMode;
  canSkipLowerLevels: boolean;
  requiredCount: number;
  approvedCount: number;
  isSatisfied: boolean;
  approvedUserIds: string[];
  pendingUserIds: string[];
};

export type TApprovalRequestLevelStatus = {
  levelOrder: number;
  name: string;
  status: number;
  groups: TApprovalRequestGroupStatus[];
};

export type TApprovalPendingRequest = {
  requestId: string;
  workflowId: string;
  companyId: number;
  entityType: string;
  entityId: string;
  actionType: number;
  status: number;
  requestedByUserId: string;
  requestedAtUtc: string;
  completedAtUtc?: string | null;
  currentFocusLevelOrder: number;
  payloadSnapshot?: string | null;
  pendingResponderUserIds: string[];
  levels: TApprovalRequestLevelStatus[];
};
