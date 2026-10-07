import type { TAlert, TAlertUiStatus } from "../types";

export const getAlertUiStatus = (
  alert: Pick<TAlert, "isDone" | "isCanceled" | "triggerAt">,
): TAlertUiStatus => {
  if (alert.isDone) return "done";
  if (alert.isCanceled) return "canceled";

  const triggerMs = new Date(alert.triggerAt).getTime();
  if (!Number.isNaN(triggerMs) && triggerMs > Date.now()) {
    return "scheduled";
  }

  return "live";
};

export const isAlertOpen = (alert: Pick<TAlert, "isDone" | "isCanceled">) =>
  !alert.isDone && !alert.isCanceled;
