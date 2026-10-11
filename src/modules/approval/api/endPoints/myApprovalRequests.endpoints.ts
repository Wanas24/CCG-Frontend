import { createEndpoint } from "@/lib/api/createEndpoint";

export const myApprovalRequestsEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/User/approval-requests`,
    auth: "required",
    skipToast: true,
  }),
  counts: createEndpoint({
    method: "GET",
    path: `/User/approval-requests/counts`,
    auth: "required",
    skipToast: true,
  }),
};
