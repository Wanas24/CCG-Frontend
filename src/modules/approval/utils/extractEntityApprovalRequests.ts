import type {
  TApprovalPendingRequest,
  TGetEntityApprovalRequestsResponse,
} from "../types";

const asRequestArray = (value: unknown): TApprovalPendingRequest[] =>
  Array.isArray(value) ? (value as TApprovalPendingRequest[]) : [];

export const extractEntityApprovalRequests = (
  response: TGetEntityApprovalRequestsResponse | undefined,
): TApprovalPendingRequest[] => {
  if (!response?.isSuccess || response.data == null) {
    return [];
  }

  const payload = response.data as unknown;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  return asRequestArray(
    record.data ?? record.Data ?? record.items ?? record.Items,
  );
};
