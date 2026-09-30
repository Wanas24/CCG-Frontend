import { createEndpoint } from "@/lib/api/createEndpoint";

export const companyEndpoints = {
  getCurrent: createEndpoint({
    method: "GET",
    path: `/Company`,
    auth: "required",
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Company`,
    auth: "required",
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Company`,
    auth: "required",
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Company`,
    auth: "required",
  }),
  getLogo: createEndpoint({
    method: "GET",
    path: `/Company/logo`,
    auth: "required",
  }),
  uploadLogo: createEndpoint({
    method: "POST",
    path: `/Company/logo`,
    auth: "required",
  }),
  deleteLogo: createEndpoint({
    method: "DELETE",
    path: `/Company/logo`,
    auth: "required",
  }),
};
