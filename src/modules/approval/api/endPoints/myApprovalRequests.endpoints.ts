import { createEndpoint } from "@/lib/api/createEndpoint";

export const myApprovalRequestsEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/MyApprovals/approval-requests`,
    auth: "required",
    skipToast: true,
  }),
  counts: createEndpoint({
    method: "GET",
    path: `/MyApprovals/approval-requests/counts`,
    auth: "required",
    skipToast: true,
  }),
  cancel: createEndpoint({
    method: "POST",
    path: `/MyApprovals/:requestId/cancel`,
    auth: "required",
  }),
};
