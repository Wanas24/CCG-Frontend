export const reportLayoutQueryRootKey = ["report-layout"] as const;

export const reportLayoutsQueryKey = (includeInactive: boolean) =>
  [...reportLayoutQueryRootKey, "list", { includeInactive }] as const;

export const reportLayoutSummaryQueryKey = (includeInactive: boolean) =>
  [...reportLayoutQueryRootKey, "summary", { includeInactive }] as const;

export const reportLayoutDetailQueryKey = (layoutId: string) =>
  [...reportLayoutQueryRootKey, "detail", layoutId] as const;
