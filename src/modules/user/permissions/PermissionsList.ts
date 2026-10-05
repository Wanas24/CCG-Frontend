export const PermissionsList = {
  Ai:{
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
  ProjectEmployee: {
    GetActiveProjects: "ProjectEmployee.GetActiveProjects",
    SetProjects: "ProjectEmployee.SetProjects",
  },
} as const;

type DeepStringValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? DeepStringValues<T[keyof T]>
    : never;

export type AppPermission = DeepStringValues<typeof PermissionsList>;
