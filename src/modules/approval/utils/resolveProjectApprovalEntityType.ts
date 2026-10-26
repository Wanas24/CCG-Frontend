import type { TApprovalEntityType } from "../types";

export const resolveProjectApprovalEntityType = (
  entityTypes: TApprovalEntityType[],
): string | null => {
  const match = entityTypes.find((item) => {
    const key = item.key?.trim().toLowerCase() ?? "";
    const value = item.value?.trim().toLowerCase() ?? "";
    return key === "project" || value === "project";
  });

  return match?.key?.trim() || null;
};
