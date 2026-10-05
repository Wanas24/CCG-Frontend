export const APPROVAL_HINT_KEYS = [
  "actionScope",
  "requirementMode",
  "minApprovals",
  "canSkipLowerLevels",
  "coverageFallback",
  "lockedByPending",
  "forceDecide",
] as const;

export type ApprovalHintKey = (typeof APPROVAL_HINT_KEYS)[number];

export const approvalHintI18nKey = (key: ApprovalHintKey) =>
  `approval.hints.${key}` as const;
