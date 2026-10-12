import { createEndpoint } from "@/lib/api/createEndpoint";

export const alertEndpoints = {
  mine: createEndpoint({
    method: "GET",
    path: `/Alert/mine`,
    auth: "required",
  }),
  employees: createEndpoint({
    method: "GET",
    path: `/Alert/employees`,
    auth: "required",
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Alert`,
    auth: "required",
  }),
  done: createEndpoint({
    method: "POST",
    path: `/Alert/:id/done`,
    auth: "required",
  }),
  cancel: createEndpoint({
    method: "POST",
    path: `/Alert/:id/cancel`,
    auth: "required",
  }),
  remove: createEndpoint({
    method: "DELETE",
    path: `/Alert/:id`,
    auth: "required",
  }),
};
