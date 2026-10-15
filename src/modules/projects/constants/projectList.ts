export const PROJECTS_PAGE_SIZE = 10;

export const PROJECT_SORT_BY = "Id";

export const ProjectStatus = {
  Draft: 1,
  SentToClient: 2,
  Rejected: 3,
  Approved: 4,
  Cancelled: 5,
  Completed: 6,
  OnHold: 7,
} as const;

export const ProjectApprovalStatus = {
  Pending: 1,
  Approved: 2,
  Returned: 3,
} as const;

export const ProjectType = {
  Residential: 1,
  Commercial: 2,
  Industrial: 3,
  Hospital: 4,
  School: 5,
  Infrastructure: 6,
  Road: 7,
  Bridge: 8,
  Government: 9,
  Private: 10,
} as const;

export const PROJECT_STATUS_OPTIONS = [
  ProjectStatus.Draft,
  ProjectStatus.SentToClient,
  ProjectStatus.Rejected,
  ProjectStatus.Approved,
  ProjectStatus.Cancelled,
  ProjectStatus.Completed,
  ProjectStatus.OnHold,
] as const;

export const PROJECT_APPROVAL_OPTIONS = [
  ProjectApprovalStatus.Pending,
  ProjectApprovalStatus.Approved,
  ProjectApprovalStatus.Returned,
] as const;

export const PROJECT_TYPE_OPTIONS = [
  ProjectType.Residential,
  ProjectType.Commercial,
  ProjectType.Industrial,
  ProjectType.Hospital,
  ProjectType.School,
  ProjectType.Infrastructure,
  ProjectType.Road,
  ProjectType.Bridge,
  ProjectType.Government,
  ProjectType.Private,
] as const;

export type TProjectQuickFilter = "all" | "active" | "pending" | "draft";
