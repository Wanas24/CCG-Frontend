import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const aiSubscriptionEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/AiSubscription`,
    auth: "required",
    permissions: [PermissionsList.AiSubscriptionGet],
  }),
  get: createEndpoint({
    method: "GET",
    path: `/AiSubscription/:userId`,
    auth: "required",
    permissions: [PermissionsList.AiSubscriptionGet],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/AiSubscription/:userId`,
    auth: "required",
    permissions: [PermissionsList.AiSubscriptionUpdate],
  }),
};
