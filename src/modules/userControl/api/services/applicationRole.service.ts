import { callEndpoint } from "@/lib/api/callEndpoint";
import { applicationRoleEndpoints } from "../endPoints/applicationRole.endpoints";
import { toPagedQueryParams } from "./toPagedQueryParams";
import type {
  TAssignApplicationRoleRequest,
  TAssignApplicationRoleResponse,
  TCreateApplicationRoleRequest,
  TCreateApplicationRoleResponse,
  TDeleteApplicationRoleResponse,
  TEditApplicationRoleRequest,
  TEditApplicationRoleResponse,
  TGetApplicationRolePermissionsParams,
  TGetApplicationRolePermissionsResponse,
  TGetApplicationRoleResponse,
  TGetApplicationRolesParams,
  TGetApplicationRolesResponse,
  TGetUserRolesResponse,
  TSetApplicationRolePermissionsResponse,
  TSetUserRolesRequest,
  TSetUserRolesResponse,
  TUnassignApplicationRoleResponse,
} from "../../types";

export const applicationRoleService = {
  list: (params?: TGetApplicationRolesParams) =>
    callEndpoint<TGetApplicationRolesResponse>(applicationRoleEndpoints.list, {
      queryParams: {
        ...toPagedQueryParams(params),
        ...(params?.visibility !== undefined
          ? { visibility: params.visibility }
          : {}),
      },
    }),

  get: (roleId: string) =>
    callEndpoint<TGetApplicationRoleResponse>(applicationRoleEndpoints.get, {
      pathParams: { roleId },
    }),

  getPermissions: (params?: TGetApplicationRolePermissionsParams) =>
    callEndpoint<TGetApplicationRolePermissionsResponse>(
      applicationRoleEndpoints.permissions,
      { queryParams: toPagedQueryParams(params) },
    ),

  getUserRoles: (userId: string) =>
    callEndpoint<TGetUserRolesResponse>(applicationRoleEndpoints.userRoles, {
      pathParams: { userId },
    }),

  create: (body: TCreateApplicationRoleRequest) =>
    callEndpoint<TCreateApplicationRoleResponse, TCreateApplicationRoleRequest>(
      applicationRoleEndpoints.create,
      { body },
    ),

  edit: (body: TEditApplicationRoleRequest) =>
    callEndpoint<TEditApplicationRoleResponse, TEditApplicationRoleRequest>(
      applicationRoleEndpoints.edit,
      { body },
    ),

  delete: (roleId: string) =>
    callEndpoint<TDeleteApplicationRoleResponse>(
      applicationRoleEndpoints.delete,
      { pathParams: { roleId } },
    ),

  setPermissions: (roleId: string, permissionIds: number[]) =>
    callEndpoint<TSetApplicationRolePermissionsResponse, number[]>(
      applicationRoleEndpoints.setPermissions,
      { pathParams: { roleId }, body: permissionIds },
    ),

  assign: (body: TAssignApplicationRoleRequest) =>
    callEndpoint<
      TAssignApplicationRoleResponse,
      TAssignApplicationRoleRequest
    >(applicationRoleEndpoints.assign, { body }),

  unassign: (userId: string, roleId: string) =>
    callEndpoint<TUnassignApplicationRoleResponse>(
      applicationRoleEndpoints.unassign,
      { pathParams: { userId, roleId } },
    ),

  setUserRoles: (body: TSetUserRolesRequest) =>
    callEndpoint<TSetUserRolesResponse, TSetUserRolesRequest>(
      applicationRoleEndpoints.setUserRoles,
      { body },
    ),
};
