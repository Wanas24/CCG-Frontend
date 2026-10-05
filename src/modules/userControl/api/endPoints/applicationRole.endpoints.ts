import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const applicationRoleEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/ApplicationRole`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.Get],
    skipToast: true,
  }),
  get: createEndpoint({
    method: "GET",
    path: `/ApplicationRole/:roleId`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.Get],
    skipToast: true,
  }),
  permissions: createEndpoint({
    method: "GET",
    path: `/ApplicationRole/permissions`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.GetAllPermissions],
    skipToast: true,
  }),
  userRoles: createEndpoint({
    method: "GET",
    path: `/ApplicationRole/user/:userId/roles`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.GetUserRoles],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/ApplicationRole`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.Create],
  }),
  edit: createEndpoint({
    method: "PUT",
    path: `/ApplicationRole`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/ApplicationRole/:roleId`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.Delete],
  }),
  setPermissions: createEndpoint({
    method: "POST",
    path: `/ApplicationRole/:roleId/assign-permissions`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.AssignPermissions],
  }),
  assign: createEndpoint({
    method: "POST",
    path: `/ApplicationRole/assign`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.AssignRoleToUser],
  }),
  unassign: createEndpoint({
    method: "DELETE",
    path: `/ApplicationRole/user/:userId/roles/:roleId`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.UnassignRoleFromUser],
  }),
  setUserRoles: createEndpoint({
    method: "PUT",
    path: `/ApplicationRole/edit-user-roles`,
    auth: "required",
    permissions: [PermissionsList.ApplicationRole.EditUserRoles],
    skipToast: true,
  }),
};
