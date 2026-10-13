import { AlertEntityType, type TAlert } from "../types";

export const isAlertForProject = (
  alert: TAlert,
  projectId: number,
): boolean => {
  if (alert.projectId != null && Number(alert.projectId) === projectId) {
    return true;
  }

  return (
    Number(alert.entityType) === AlertEntityType.Project &&
    alert.entityId != null &&
    Number(alert.entityId) === projectId
  );
};
