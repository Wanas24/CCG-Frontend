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

export const approvalEntityRequestsQueryKey = (
  entityType: string,
  entityId: string,
  take: number,
) =>
  [
    ...approvalQueryRootKey,
    "entity-requests",
    { entityType, entityId, take },
  ] as const;

export const approvalActiveEntityRequestQueryKey = (
  entityType: string,
  entityId: string,
) =>
  [
    ...approvalQueryRootKey,
    "active-entity-request",
    { entityType, entityId },
  ] as const;
