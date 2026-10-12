import {
  ProjectApprovalStatus,
  ProjectStatus,
  ProjectType,
} from "../constants/projectList";

const STATUS_LABEL_KEYS = {
  [ProjectStatus.Draft]: "projects.status.draft",
  [ProjectStatus.SentToClient]: "projects.status.sentToClient",
  [ProjectStatus.Rejected]: "projects.status.rejected",
  [ProjectStatus.Approved]: "projects.status.approved",
  [ProjectStatus.Cancelled]: "projects.status.cancelled",
  [ProjectStatus.Completed]: "projects.status.completed",
  [ProjectStatus.OnHold]: "projects.status.onHold",
} as const;

const APPROVAL_LABEL_KEYS = {
  [ProjectApprovalStatus.Pending]: "projects.approval.pending",
  [ProjectApprovalStatus.Approved]: "projects.approval.approved",
  [ProjectApprovalStatus.Returned]: "projects.approval.returned",
} as const;

const TYPE_LABEL_KEYS = {
  [ProjectType.Residential]: "projects.type.residential",
  [ProjectType.Commercial]: "projects.type.commercial",
  [ProjectType.Industrial]: "projects.type.industrial",
  [ProjectType.Hospital]: "projects.type.hospital",
  [ProjectType.School]: "projects.type.school",
  [ProjectType.Infrastructure]: "projects.type.infrastructure",
  [ProjectType.Road]: "projects.type.road",
  [ProjectType.Bridge]: "projects.type.bridge",
  [ProjectType.Government]: "projects.type.government",
  [ProjectType.Private]: "projects.type.private",
} as const;

type StatusLabelKey =
  (typeof STATUS_LABEL_KEYS)[keyof typeof STATUS_LABEL_KEYS];
type ApprovalLabelKey =
  (typeof APPROVAL_LABEL_KEYS)[keyof typeof APPROVAL_LABEL_KEYS];
type TypeLabelKey = (typeof TYPE_LABEL_KEYS)[keyof typeof TYPE_LABEL_KEYS];

export const projectStatusLabelKey = (
  value: number | null | undefined,
): StatusLabelKey | null => {
  if (value == null) return null;
  if (Object.prototype.hasOwnProperty.call(STATUS_LABEL_KEYS, value)) {
    return STATUS_LABEL_KEYS[value as keyof typeof STATUS_LABEL_KEYS];
  }
  return null;
};

export const projectApprovalLabelKey = (
  value: number | null | undefined,
): ApprovalLabelKey | null => {
  if (value == null) return null;
  if (Object.prototype.hasOwnProperty.call(APPROVAL_LABEL_KEYS, value)) {
    return APPROVAL_LABEL_KEYS[value as keyof typeof APPROVAL_LABEL_KEYS];
  }
  return null;
};

export const projectTypeLabelKey = (
  value: number | null | undefined,
): TypeLabelKey | null => {
  if (value == null) return null;
  if (Object.prototype.hasOwnProperty.call(TYPE_LABEL_KEYS, value)) {
    return TYPE_LABEL_KEYS[value as keyof typeof TYPE_LABEL_KEYS];
  }
  return null;
};

export const projectSiteLine = (project: {
  city?: string | null;
  district?: string | null;
  street?: string | null;
  hasLocation?: boolean | null;
}) =>
  [project.city, project.district, project.street].filter(Boolean).join(", ");
