export const approvalQueryRootKey = ["approval"] as const;

export const approvalEntityTypesQueryKey = [
  ...approvalQueryRootKey,
  "entity-types",
] as const;

export const approvalWorkflowsQueryKey = (includeInactive: boolean) =>
  [...approvalQueryRootKey, "workflows", { includeInactive }] as const;

export const approvalPendingRequestsQueryKey = [
  ...approvalQueryRootKey,
  "pending-requests",
] as const;
