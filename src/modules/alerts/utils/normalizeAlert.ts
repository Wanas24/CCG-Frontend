import type { TAlert } from "../types";

type AlertRecord = TAlert & {
  ProjectId?: number | null;
  EntityId?: number | null;
  EntityType?: number | string | null;
  EntityTypeName?: string | null;
  ProjectName?: string | null;
};

export const normalizeAlert = (alert: TAlert): TAlert => {
  const raw = alert as AlertRecord;

  return {
    ...alert,
    message: String(alert.message ?? "").trim(),
    receivers: alert.receivers ?? [],
    isDone: Boolean(alert.isDone),
    isCanceled: Boolean(alert.isCanceled),
    assignToAllEmployees: Boolean(alert.assignToAllEmployees),
    projectId: alert.projectId ?? raw.ProjectId ?? null,
    entityId: alert.entityId ?? raw.EntityId ?? null,
    entityType: alert.entityType ?? raw.EntityType ?? null,
    entityTypeName: alert.entityTypeName ?? raw.EntityTypeName ?? undefined,
    projectName: alert.projectName ?? raw.ProjectName ?? undefined,
  };
};
