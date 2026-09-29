import type { TSimpleResult } from "@/modules/authentication/types";

export type TPermission = {
  id: string;
  name: string;
  displayName: string;
  description: string;
};

export type TCurrentUserPermissions = {
  isAdmin: boolean;
  isManager: boolean;
  permissions: TPermission[];
};

export type TGetCurrentUserPermissionsResponse =
  TSimpleResult<TCurrentUserPermissions>;
