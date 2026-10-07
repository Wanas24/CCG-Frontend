import type { TAlert, TAlertAudienceMode } from "../types";

export const getAlertAudienceMode = (values: {
  assignToAllEmployees: boolean;
  assignToManagers: boolean;
}): TAlertAudienceMode => {
  if (values.assignToAllEmployees) return "everyone";
  if (values.assignToManagers) return "managers";
  return "people";
};

export const formatAlertAudienceSummary = (
  alert: Pick<TAlert, "assignToAllEmployees" | "receivers">,
  labels: {
    everyone: string;
    noPeople: string;
  },
): string => {
  if (alert.assignToAllEmployees) {
    return labels.everyone;
  }

  const receivers = alert.receivers ?? [];
  if (!receivers.length) {
    return labels.noPeople;
  }

  const names = receivers
    .slice(0, 3)
    .map((receiver) => receiver.fullName?.trim() || receiver.email || "")
    .filter(Boolean);

  const extra = receivers.length > 3 ? ` +${receivers.length - 3}` : "";
  return `${names.join(", ")}${extra}`;
};

export const getAlertEmployeeLabel = (employee: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string => {
  const name = `${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim();
  return name || employee.email?.trim() || "";
};
