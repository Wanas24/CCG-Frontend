import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const reportLayoutAccessPermissions = [
  PermissionsList.ReportLayout.GetLayouts,
] as const;

type TReportLayoutAccessInput = {
  isAdmin: boolean;
  isManager: boolean;
  granted: ReadonlySet<string>;
};

export const canAccessReportLayouts = ({
  isAdmin,
  isManager,
  granted,
}: TReportLayoutAccessInput) =>
  isAdmin ||
  isManager ||
  granted.has(PermissionsList.ReportLayout.GetLayouts);
