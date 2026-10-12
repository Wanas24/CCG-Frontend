import { createEndpoint } from "@/lib/api/createEndpoint";

export const clientEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Client`,
    auth: "required",
    skipToast: true,
  }),
};
