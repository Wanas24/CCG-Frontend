import { createEndpoint } from "@/lib/api/createEndpoint";

export const userEndpoints = {
  getUser: createEndpoint({
    method: "GET",
    path: `/User`,
    auth: "required",
  }),
};
