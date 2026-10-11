import { approvalQueryRootKey } from "./approvalWorkflowQueryKeys";
import type {
  TGetMyApprovalRequestCountsParams,
  TGetMyApprovalRequestsParams,
} from "../../types/myApprovalRequest";

export const myApprovalRequestsRootKey = [
  ...approvalQueryRootKey,
  "my-requests",
] as const;

export const myApprovalRequestsListQueryKey = (
  params: TGetMyApprovalRequestsParams,
) => [...myApprovalRequestsRootKey, "list", params] as const;

export const myApprovalRequestCountsQueryKey = (
  params: TGetMyApprovalRequestCountsParams,
) => [...myApprovalRequestsRootKey, "counts", params] as const;
