import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const measurementEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Measurement`,
    auth: "required",
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Measurement`,
    auth: "required",
    permissions: [PermissionsList.Measurement.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Measurement`,
    auth: "required",
    permissions: [PermissionsList.Measurement.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Measurement/:id`,
    auth: "required",
    permissions: [PermissionsList.Measurement.Delete],
  }),
};
