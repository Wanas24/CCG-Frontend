import type { TAlert } from "../types";

export const normalizeAlert = (alert: TAlert): TAlert => ({
  ...alert,
  message: String(alert.message ?? "").trim(),
  receivers: alert.receivers ?? [],
  isDone: Boolean(alert.isDone),
  isCanceled: Boolean(alert.isCanceled),
  assignToAllEmployees: Boolean(alert.assignToAllEmployees),
});
