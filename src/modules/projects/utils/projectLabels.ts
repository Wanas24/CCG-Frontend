import {
  ProjectApprovalStatus,
  ProjectStatus,
  ProjectType,
} from "../constants/projectList";

const STATUS_LABEL_KEYS: Record<number, string> = {
  [ProjectStatus.Draft]: "projects.status.draft",
  [ProjectStatus.SentToClient]: "projects.status.sentToClient",
  [ProjectStatus.Rejected]: "projects.status.rejected",
  [ProjectStatus.Approved]: "projects.status.approved",
  [ProjectStatus.Cancelled]: "projects.status.cancelled",
  [ProjectStatus.Completed]: "projects.status.completed",
  [ProjectStatus.OnHold]: "projects.status.onHold",
};

const APPROVAL_LABEL_KEYS: Record<number, string> = {
  [ProjectApprovalStatus.Pending]: "projects.approval.pending",
  [ProjectApprovalStatus.Approved]: "projects.approval.approved",
  [ProjectApprovalStatus.Returned]: "projects.approval.returned",
};

const TYPE_LABEL_KEYS: Record<number, string> = {
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
};

export const projectStatusLabelKey = (value: number | null | undefined) =>
  value == null ? null : (STATUS_LABEL_KEYS[value] ?? null);

export const projectApprovalLabelKey = (value: number | null | undefined) =>
  value == null ? null : (APPROVAL_LABEL_KEYS[value] ?? null);

export const projectTypeLabelKey = (value: number | null | undefined) =>
  value == null ? null : (TYPE_LABEL_KEYS[value] ?? null);

export const projectSiteLine = (project: {
  city?: string | null;
  district?: string | null;
  street?: string | null;
  hasLocation?: boolean | null;
}) =>
  [project.city, project.district, project.street].filter(Boolean).join(", ");
