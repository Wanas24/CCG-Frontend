import {
  MyApprovalRequestAction,
  MyApprovalRequestDecision,
  MyApprovalRequestLevelStatus,
  MyApprovalRequestStatus,
} from "../types/myApprovalRequest";

const codeOf = (
  value: unknown,
  table: Record<number, string>,
): number | null => {
  if (value == null || value === "") {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(table, Number(value))) {
    return Number(value);
  }

  const text = String(value).toLowerCase();
  const hit = Object.entries(table).find(
    ([, name]) => name.toLowerCase() === text,
  );
  return hit ? Number(hit[0]) : null;
};

export const MY_APPROVAL_STATUS_LABEL_KEYS = {
  [MyApprovalRequestStatus.Pending]: "approval.myRequests.status.pending",
  [MyApprovalRequestStatus.Approved]: "approval.myRequests.status.approved",
  [MyApprovalRequestStatus.Rejected]: "approval.myRequests.status.rejected",
  [MyApprovalRequestStatus.Cancelled]: "approval.myRequests.status.cancelled",
} as const;

export const MY_APPROVAL_ACTION_LABEL_KEYS = {
  [MyApprovalRequestAction.Create]: "approval.scopes.create",
  [MyApprovalRequestAction.Update]: "approval.scopes.update",
  [MyApprovalRequestAction.Delete]: "approval.scopes.delete",
} as const;

export const MY_APPROVAL_DECISION_LABEL_KEYS = {
  [MyApprovalRequestDecision.Approve]: "approval.myRequests.decision.approve",
  [MyApprovalRequestDecision.Reject]: "approval.myRequests.decision.reject",
  [MyApprovalRequestDecision.Skip]: "approval.myRequests.decision.skip",
} as const;

export const MY_APPROVAL_LEVEL_STATUS_LABEL_KEYS = {
  [MyApprovalRequestLevelStatus.NotStarted]:
    "approval.myRequests.levelStatus.notStarted",
  [MyApprovalRequestLevelStatus.Open]: "approval.myRequests.levelStatus.open",
  [MyApprovalRequestLevelStatus.Completed]:
    "approval.myRequests.levelStatus.completed",
  [MyApprovalRequestLevelStatus.Skipped]:
    "approval.myRequests.levelStatus.skipped",
} as const;

const STATUS_NAME_TABLE: Record<number, string> = {
  [MyApprovalRequestStatus.Pending]: "Pending",
  [MyApprovalRequestStatus.Approved]: "Approved",
  [MyApprovalRequestStatus.Rejected]: "Rejected",
  [MyApprovalRequestStatus.Cancelled]: "Cancelled",
};

const ACTION_NAME_TABLE: Record<number, string> = {
  [MyApprovalRequestAction.Create]: "Create",
  [MyApprovalRequestAction.Update]: "Update",
  [MyApprovalRequestAction.Delete]: "Delete",
};

const DECISION_NAME_TABLE: Record<number, string> = {
  [MyApprovalRequestDecision.Approve]: "Approve",
  [MyApprovalRequestDecision.Reject]: "Reject",
  [MyApprovalRequestDecision.Skip]: "Skip",
};

const LEVEL_NAME_TABLE: Record<number, string> = {
  [MyApprovalRequestLevelStatus.NotStarted]: "Not started",
  [MyApprovalRequestLevelStatus.Open]: "Open",
  [MyApprovalRequestLevelStatus.Completed]: "Completed",
  [MyApprovalRequestLevelStatus.Skipped]: "Skipped",
};

export const resolveMyApprovalStatusCode = (value: unknown) =>
  codeOf(value, STATUS_NAME_TABLE);

export const resolveMyApprovalActionCode = (value: unknown) =>
  codeOf(value, ACTION_NAME_TABLE);

export const resolveMyApprovalDecisionCode = (value: unknown) =>
  codeOf(value, DECISION_NAME_TABLE);

export const resolveMyApprovalLevelStatusCode = (value: unknown) =>
  codeOf(value, LEVEL_NAME_TABLE);

export const myApprovalStatusLabelKey = (value: unknown) => {
  const code = resolveMyApprovalStatusCode(value);
  return code == null
    ? null
    : MY_APPROVAL_STATUS_LABEL_KEYS[
        code as keyof typeof MY_APPROVAL_STATUS_LABEL_KEYS
      ];
};

export const myApprovalActionLabelKey = (value: unknown) => {
  const code = resolveMyApprovalActionCode(value);
  return code == null
    ? null
    : MY_APPROVAL_ACTION_LABEL_KEYS[
        code as keyof typeof MY_APPROVAL_ACTION_LABEL_KEYS
      ];
};

export const myApprovalDecisionLabelKey = (value: unknown) => {
  const code = resolveMyApprovalDecisionCode(value);
  return code == null
    ? null
    : MY_APPROVAL_DECISION_LABEL_KEYS[
        code as keyof typeof MY_APPROVAL_DECISION_LABEL_KEYS
      ];
};

export const myApprovalLevelStatusLabelKey = (value: unknown) => {
  const code = resolveMyApprovalLevelStatusCode(value);
  return code == null
    ? null
    : MY_APPROVAL_LEVEL_STATUS_LABEL_KEYS[
        code as keyof typeof MY_APPROVAL_LEVEL_STATUS_LABEL_KEYS
      ];
};

export const humanizeApprovalFieldKey = (key: string) => {
  const pascal = key.charAt(0).toUpperCase() + key.slice(1);
  return pascal.replace(/([a-z])([A-Z])/g, "$1 $2");
};
