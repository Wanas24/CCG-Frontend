import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const projectEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Get],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Delete],
  }),
};
