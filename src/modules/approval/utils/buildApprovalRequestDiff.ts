import {
  MyApprovalRequestAction,
  type TApprovalRequestDiffRow,
  type TMyApprovalRequest,
} from "../types/myApprovalRequest";
import { resolveMyApprovalActionCode } from "./myApprovalRequestMaps";

const asObject = (
  value: string | Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  if (!value) {
    return {};
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }

  return {};
};

const sameValue = (a: unknown, b: unknown) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export const buildApprovalRequestDiff = (
  request: TMyApprovalRequest,
): TApprovalRequestDiffRow[] => {
  const action = resolveMyApprovalActionCode(request.actionType);
  const proposed = asObject(request.payloadSnapshot);
  const previous = asObject(request.revertSnapshot);

  const beforeSource =
    action === MyApprovalRequestAction.Create
      ? {}
      : action === MyApprovalRequestAction.Delete
        ? proposed
        : previous;
  const afterSource =
    action === MyApprovalRequestAction.Delete ? {} : proposed;

  const keys = [
    ...new Set([...Object.keys(beforeSource), ...Object.keys(afterSource)]),
  ].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  return keys.map((key) => {
    const before = beforeSource[key];
    const after = afterSource[key];
    const beforeMissing = !Object.prototype.hasOwnProperty.call(
      beforeSource,
      key,
    );
    const afterMissing = !Object.prototype.hasOwnProperty.call(
      afterSource,
      key,
    );

    let kind: TApprovalRequestDiffRow["kind"] = "same";
    if (beforeMissing && !afterMissing) {
      kind = "added";
    } else if (!beforeMissing && afterMissing) {
      kind = "removed";
    } else if (!sameValue(before, after)) {
      kind = "changed";
    }

    return { key, before, after, kind };
  });
};

export const formatApprovalDiffDisplayValue = (
  value: unknown,
): { text: string; empty: boolean; booleanValue?: boolean } => {
  if (value == null || value === "") {
    return { text: "", empty: true };
  }

  if (typeof value === "boolean") {
    return { text: "", empty: false, booleanValue: value };
  }

  if (typeof value === "object") {
    return { text: JSON.stringify(value), empty: false };
  }

  return { text: String(value), empty: false };
};
