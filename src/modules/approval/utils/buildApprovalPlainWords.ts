import type { TFunction } from "i18next";
import {
  ApprovalActionScope,
  ApprovalApproverType,
  ApprovalRequirementMode,
  type TApprovalActionScope,
} from "../types";

type PlainWordsGroup = {
  approverType: number;
  approverKey: string;
  requirementMode: number;
  minApprovals: number;
  canSkipLowerLevels: boolean;
};

type PlainWordsLevel = {
  key: string;
  name: string;
  groups: PlainWordsGroup[];
};

type PlainWordsDraft = {
  actionScope: TApprovalActionScope;
  levels: PlainWordsLevel[];
};

export type ApprovalPlainWordsContent =
  | { empty: true; emptyMessage: string }
  | {
      empty: false;
      intro: string;
      levels: { key: string; heading: string; detail: string }[];
      decline: string;
    };

type ResolveApproverLabel = (
  approverType: number,
  approverKey: string,
) => string | null;

const introKeyForScope = (scope: TApprovalActionScope) => {
  switch (scope) {
    case ApprovalActionScope.Create:
      return "approval.builder.plainWordsIntroCreate" as const;
    case ApprovalActionScope.Update:
      return "approval.builder.plainWordsIntroUpdate" as const;
    case ApprovalActionScope.Delete:
      return "approval.builder.plainWordsIntroDelete" as const;
    default:
      return "approval.builder.plainWordsIntroAll" as const;
  }
};

const describeGroup = (
  group: PlainWordsGroup,
  resolveApproverLabel: ResolveApproverLabel,
  t: TFunction,
): string => {
  const isRole = group.approverType === ApprovalApproverType.Role;
  const selected = group.approverKey.trim();

  let detail: string;

  if (!selected) {
    detail = isRole
      ? t("approval.builder.plainWordsUnselectedRole")
      : t("approval.builder.plainWordsUnselectedPerson");
  } else if (isRole) {
    const role =
      resolveApproverLabel(group.approverType, selected) ?? selected;
    if (group.requirementMode === ApprovalRequirementMode.All) {
      detail = t("approval.builder.plainWordsRoleAll", { role });
    } else if (group.minApprovals <= 1) {
      detail = t("approval.builder.plainWordsRoleAnyOne", { role });
    } else {
      detail = t("approval.builder.plainWordsRoleAny", {
        role,
        count: group.minApprovals,
      });
    }
  } else {
    const name =
      resolveApproverLabel(group.approverType, selected) ?? selected;
    detail = t("approval.builder.plainWordsPerson", { name });
  }

  if (group.canSkipLowerLevels) {
    return `${detail} ${t("approval.builder.plainWordsCanSkip")}`;
  }

  return detail;
};

const describeLevel = (
  level: PlainWordsLevel,
  index: number,
  resolveApproverLabel: ResolveApproverLabel,
  t: TFunction,
): { key: string; heading: string; detail: string } => {
  const levelName = t("approval.builder.levelLabel", { index });
  const heading = level.name.trim()
    ? t("approval.builder.plainWordsLevelNamed", {
        index,
        level: levelName,
        name: level.name.trim(),
      })
    : t("approval.builder.plainWordsLevel", {
        index,
        level: levelName,
      });

  if (level.groups.length === 0) {
    return {
      key: level.key,
      heading,
      detail: t("approval.builder.plainWordsNoApprovers"),
    };
  }

  const parts = level.groups.map((group) =>
    describeGroup(group, resolveApproverLabel, t),
  );

  return {
    key: level.key,
    heading,
    detail: parts.join(t("approval.builder.plainWordsAnd")),
  };
};

export const buildApprovalPlainWords = (
  draft: PlainWordsDraft,
  options: {
    entityLabel: string | null;
    resolveApproverLabel: ResolveApproverLabel;
    t: TFunction;
  },
): ApprovalPlainWordsContent => {
  const { t, resolveApproverLabel } = options;
  const entity =
    options.entityLabel?.trim() ||
    t("approval.builder.plainWordsEntityFallback");

  if (draft.levels.length === 0) {
    return {
      empty: true,
      emptyMessage: t("approval.builder.plainWordsEmpty"),
    };
  }

  return {
    empty: false,
    intro: t(introKeyForScope(draft.actionScope), { entity }),
    levels: draft.levels.map((level, index) =>
      describeLevel(level, index + 1, resolveApproverLabel, t),
    ),
    decline: t("approval.builder.plainWordsDecline"),
  };
};
