import type { TApprovalPendingRequest } from "../types";
import { MyApprovalRequestStatus } from "../types/myApprovalRequest";
import { resolveMyApprovalStatusCode } from "./myApprovalRequestMaps";

export const isActionableApprovalRequest = (
  request: Pick<TApprovalPendingRequest, "status">,
): boolean =>
  resolveMyApprovalStatusCode(request.status) ===
  MyApprovalRequestStatus.Pending;
