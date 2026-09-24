import { createEndpoint } from "@/lib/api/createEndpoint";

export const authEndpoints = {
  login: createEndpoint({
    method: "POST",
    path: `/auth/login`,
    auth: "none",
  }),
  register: createEndpoint({
    method: "POST",
    path: `/auth/register`,
    auth: "none",
  }),
};
