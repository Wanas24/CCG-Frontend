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
};
