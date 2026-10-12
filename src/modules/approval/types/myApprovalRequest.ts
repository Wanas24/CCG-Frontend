import type { TSimpleResult } from "@/modules/authentication/types";

type TMyApprovalPagedResult<T> = {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const MyApprovalRequestStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Cancelled: 3,
} as const;

export type TMyApprovalRequestStatus =
  (typeof MyApprovalRequestStatus)[keyof typeof MyApprovalRequestStatus];

export const MyApprovalRequestAction = {
  Create: 0,
  Update: 1,
  Delete: 2,
} as const;

export type TMyApprovalRequestAction =
  (typeof MyApprovalRequestAction)[keyof typeof MyApprovalRequestAction];

export const MyApprovalRequestDecision = {
  Approve: 0,
  Reject: 1,
  Skip: 2,
} as const;

export type TMyApprovalRequestDecision =
  (typeof MyApprovalRequestDecision)[keyof typeof MyApprovalRequestDecision];

export const MyApprovalRequestLevelStatus = {
  NotStarted: 0,
  Open: 1,
  Completed: 2,
  Skipped: 3,
} as const;

export type TMyApprovalRequestLevelStatus =
  (typeof MyApprovalRequestLevelStatus)[keyof typeof MyApprovalRequestLevelStatus];

export type TMyApprovalRequestGroup = {
  isSatisfied?: boolean;
  canSkipLowerLevels?: boolean;
  pendingUserIds?: string[];
};

export type TMyApprovalRequestLevel = {
  levelOrder: number;
  name?: string | null;
  status: number;
  groups?: TMyApprovalRequestGroup[];
};

export type TMyApprovalRequestDecisionItem = {
  actorUserId?: string | null;
  decision: number;
  decidedAtUtc?: string | null;
  comment?: string | null;
};

export type TMyApprovalRequest = {
  requestId: string;
  entityType: string;
  entityId: string;
  actionType: number;
  status: number;
  requestedByUserId: string;
  requestedAtUtc: string;
  completedAtUtc?: string | null;
  currentFocusLevelOrder?: number | null;
  payloadSnapshot?: string | Record<string, unknown> | null;
  revertSnapshot?: string | Record<string, unknown> | null;
  levels?: TMyApprovalRequestLevel[];
  decisions?: TMyApprovalRequestDecisionItem[];
  pendingResponderUserIds?: string[];
  userNames?: Record<string, string> | null;
};

export type TMyApprovalRequestCounts = {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
};

export type TGetMyApprovalRequestsParams = {
  page?: number;
  pageSize?: number;
  sortDescending?: boolean;
  entityType?: string;
  status?: TMyApprovalRequestStatus | "";
  search?: string;
};

export type TGetMyApprovalRequestCountsParams = {
  entityType?: string;
  search?: string;
};

export type TGetMyApprovalRequestsResponse = TSimpleResult<
  TMyApprovalPagedResult<TMyApprovalRequest>
>;

export type TGetMyApprovalRequestCountsResponse =
  TSimpleResult<TMyApprovalRequestCounts>;

export type TCancelMyApprovalRequestResponse = TSimpleResult;

export type TApprovalRequestDiffKind =
  | "same"
  | "changed"
  | "added"
  | "removed";

export type TApprovalRequestDiffRow = {
  key: string;
  before: unknown;
  after: unknown;
  kind: TApprovalRequestDiffKind;
};
