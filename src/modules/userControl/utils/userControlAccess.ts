import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const userControlAccessPermissions = [
  PermissionsList.Employee.Get,
  PermissionsList.Employee.RecruitEmployee,
  PermissionsList.ApplicationRole.Get,
  PermissionsList.ApplicationRole.GetAllPermissions,
  PermissionsList.ApplicationRole.GetUserRoles,
  PermissionsList.ApplicationRole.Create,
  PermissionsList.ApplicationRole.Edit,
  PermissionsList.ApplicationRole.Delete,
  PermissionsList.ApplicationRole.AssignPermissions,
  PermissionsList.ApplicationRole.AssignRoleToUser,
  PermissionsList.ApplicationRole.UnassignRoleFromUser,
  PermissionsList.ApplicationRole.EditUserRoles,
  PermissionsList.ProjectEmployee.GetActiveProjects,
  PermissionsList.ProjectEmployee.SetProjects,
] as const;

type UserControlAccessInput = {
  isAdmin: boolean;
  isManager: boolean;
  granted: ReadonlySet<string>;
};

export const canAccessUserControl = ({
  isAdmin,
  isManager,
  granted,
}: UserControlAccessInput) =>
  isAdmin ||
  isManager ||
  userControlAccessPermissions.some((permission) => granted.has(permission));
