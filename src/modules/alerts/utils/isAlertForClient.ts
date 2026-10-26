import { AlertEntityType, type TAlert } from "../types";

export const isAlertForClient = (alert: TAlert, clientId: number): boolean =>
  Number(alert.entityType) === AlertEntityType.Client &&
  alert.entityId != null &&
  Number(alert.entityId) === clientId;
