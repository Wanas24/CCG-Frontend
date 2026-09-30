import { createEndpoint } from "@/lib/api/createEndpoint";

export const companyEndpoints = {
  getCompanies: createEndpoint({
    method: "GET",
    path: `/Company`,
    auth: "required",
  }),
};
