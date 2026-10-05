import type {
  TGetApplicationRolePermissionsParams,
  TGetApplicationRolesParams,
} from "../../types";

export const applicationRoleQueryRootKey = ["applicationRole"] as const;

export const applicationRolesQueryKey = (
  params: TGetApplicationRolesParams = {},
) => ["applicationRole", "list", params] as const;

export const applicationRoleQueryKey = (roleId: string) =>
  ["applicationRole", "detail", roleId] as const;

export const applicationRolePermissionsQueryKey = (
  params: TGetApplicationRolePermissionsParams = {},
) => ["applicationRole", "permissions", params] as const;

export const userRolesQueryKey = (userId: string) =>
  ["applicationRole", "userRoles", userId] as const;
