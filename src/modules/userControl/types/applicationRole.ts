import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult, TPagedQueryParams } from "./paged";

export const ApplicationRoleVisibility = {
  All: 0,
  Shared: 1,
  Mine: 2,
} as const;

export type TApplicationRoleVisibility =
  (typeof ApplicationRoleVisibility)[keyof typeof ApplicationRoleVisibility];

export type TApplicationRole = {
  id: string;
  name: string;
  description: string;
  companyId: number | null;
  isShared: boolean;
  permissionsCount: number;
  usersCount: number;
};

export type TApplicationRolePermission = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
};

export type TApplicationRoleDetail = Omit<
  TApplicationRole,
  "permissionsCount"
> & {
  permissions: TApplicationRolePermission[];
};

export type TApplicationRolePermissionAction = {
  id: number;
  name: string;
  displayName: string;
  description: string;
};

export type TApplicationRolePermissionGroup = {
  name: string;
  actions: TApplicationRolePermissionAction[];
};

export type TApplicationRolePermissionsPage =
  TApiPagedResult<TApplicationRolePermissionGroup>;

export type TGetApplicationRolesParams = TPagedQueryParams & {
  visibility?: TApplicationRoleVisibility;
};

export type TGetApplicationRolesResponse = TSimpleResult<
  TApiPagedResult<TApplicationRole>
>;

export type TGetApplicationRoleResponse = TSimpleResult<TApplicationRoleDetail>;

export type TGetApplicationRolePermissionsParams = TPagedQueryParams;

export type TGetApplicationRolePermissionsResponse =
  TSimpleResult<TApplicationRolePermissionsPage>;

export type TGetUserRolesResponse = TSimpleResult<TApplicationRole[]>;

export type TCreateApplicationRoleRequest = {
  name: string;
  description?: string;
  permissionIds?: number[];
};

export type TCreateApplicationRoleResponse = TSimpleResult<string>;

export type TEditApplicationRoleRequest = {
  id: string;
  name: string;
  description: string;
  permissionIds?: number[];
};

export type TEditApplicationRoleResponse = TSimpleResult<string>;

export type TDeleteApplicationRoleResponse = TSimpleResult;

export type TSetApplicationRolePermissionsResponse = TSimpleResult;

export type TAssignApplicationRoleRequest = {
  userId: string;
  roleId: string;
};

export type TAssignApplicationRoleResponse = TSimpleResult<boolean>;

export type TUnassignApplicationRoleResponse = TSimpleResult;

export type TSetUserRolesRequest = {
  userId: string;
  roleIds: string[];
};

export type TSetUserRolesResponse = TSimpleResult<string>;
