import {
  MyApprovalRequestLevelStatus,
  MyApprovalRequestStatus,
  type TMyApprovalRequest,
} from "../types/myApprovalRequest";
import {
  resolveMyApprovalLevelStatusCode,
  resolveMyApprovalStatusCode,
} from "./myApprovalRequestMaps";

export type TMyApprovalNextApprovers = {
  ids: string[];
  levelName: string;
};

export const resolveMyApprovalRequestNextApprovers = (
  item: TMyApprovalRequest,
): TMyApprovalNextApprovers => {
  const status = resolveMyApprovalStatusCode(item.status);
  if (status !== MyApprovalRequestStatus.Pending) {
    return { ids: [], levelName: "" };
  }

  const levels = (item.levels ?? []).map((level) => ({
    order: level.levelOrder,
    name: level.name || "Level",
    status: resolveMyApprovalLevelStatusCode(level.status),
    groups: level.groups ?? [],
  }));

  const open = levels.filter(
    (level) =>
      level.status === MyApprovalRequestLevelStatus.NotStarted ||
      level.status === MyApprovalRequestLevelStatus.Open,
  );

  const focus = item.currentFocusLevelOrder;
  const currentOrder = Number(
    focus ?? open.map((level) => level.order).sort((a, b) => a - b)[0],
  );

  const ids: string[] = [];
  let onlyCurrent = true;

  for (const level of open) {
    const isCurrent = Number(level.order) === currentOrder;
    for (const group of level.groups) {
      if (group.isSatisfied) {
        continue;
      }
      if (!isCurrent && !group.canSkipLowerLevels) {
        continue;
      }
      if (!isCurrent) {
        onlyCurrent = false;
      }
      ids.push(...(group.pendingUserIds ?? []));
    }
  }

  const chosen = ids.length
    ? ids
    : (item.pendingResponderUserIds ?? []);
  const current = open.find((level) => Number(level.order) === currentOrder);

  return {
    ids: [...new Set(chosen.filter(Boolean).map((id) => String(id)))],
    levelName: onlyCurrent ? current?.name || "" : "",
  };
};
