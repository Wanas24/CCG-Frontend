export const PermissionsList = {
  Ai: {
    AiAssistantChat: "AiAssistant.Chat",
    AiAssistantAll: "AiAssistant.All",
    AiSubscriptionGet: "AiSubscription.Get",
    AiSubscriptionUpdate: "AiSubscription.Update",
  },
  Company: {
    GetCompanyInfo: "Company.GetCompanyInfo",
    Edit: "Company.Edit",
    UploadLogo: "Company.UploadLogo",
    DeleteLogo: "Company.DeleteLogo",
  },
  ApprovalWorkflow: {
    Create: "ApprovalWorkflow.Create",
    Deactivate: "ApprovalWorkflow.Deactivate",
    ForceDecide: "ApprovalWorkflow.ForceDecide",
    Get: "ApprovalWorkflow.Get",
    GetActiveEntityRequest: "ApprovalWorkflow.GetActiveEntityRequest",
    GetEntityRequests: "ApprovalWorkflow.GetEntityRequests",
    GetPendingRequests: "ApprovalWorkflow.GetPendingRequests",
    Update: "ApprovalWorkflow.Update",
  },
  ApplicationRole: {
    Get: "ApplicationRole.Get",
    GetAllPermissions: "ApplicationRole.GetAllPermissions",
    GetUserRoles: "ApplicationRole.GetUserRoles",
    Create: "ApplicationRole.Create",
    Edit: "ApplicationRole.Edit",
    Delete: "ApplicationRole.Delete",
    AssignPermissions: "ApplicationRole.AssignPermissions",
    AssignRoleToUser: "ApplicationRole.AssignRoleToUser",
    UnassignRoleFromUser: "ApplicationRole.UnassignRoleFromUser",
    EditUserRoles: "ApplicationRole.EditUserRoles",
  },
  Employee: {
    Get: "Employee.Get",
    RecruitEmployee: "Employee.RecruitEmployee",
  },
  Project: {
    Get: "Project.Get",
    Export: "Project.Export",
    Create: "Project.Create",
    Edit: "Project.Edit",
    Delete: "Project.Delete",
    GetFiles: "Project.GetFiles",
    Upload: "Project.Upload",
    Download: "Project.Download",
    DeleteFile: "Project.DeleteFile",
  },
  ProjectEmployee: {
    GetActiveProjects: "ProjectEmployee.GetActiveProjects",
    SetProjects: "ProjectEmployee.SetProjects",
  },
  Measurement: {
    Create: "Measurement.Create",
    Edit: "Measurement.Edit",
    Delete: "Measurement.Delete",
  },
  ItemCategory: {
    Create: "ItemCategory.Create",
    Delete: "ItemCategory.Delete",
    DeleteFile: "ItemCategory.DeleteFile",
    Download: "ItemCategory.Download",
    Edit: "ItemCategory.Edit",
    Get: "ItemCategory.Get",
    GetFiles: "ItemCategory.GetFiles",
    Upload: "ItemCategory.Upload",
  },
  ReportLayout: {
    GetLayouts: "ReportLayout.GetLayouts",
    GetById: "ReportLayout.GetById",
    GetLastUsedLayout: "ReportLayout.GetLastUsedLayout",
    Create: "ReportLayout.Create",
    Update: "ReportLayout.Update",
    Deactivate: "ReportLayout.Deactivate",
    PreviewSample: "ReportLayout.PreviewSample",
  },
} as const;

type DeepStringValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? DeepStringValues<T[keyof T]>
    : never;

export type AppPermission = DeepStringValues<typeof PermissionsList>;
