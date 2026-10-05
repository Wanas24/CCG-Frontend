import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const projectEmployeeEndpoints = {
  projects: createEndpoint({
    method: "GET",
    path: `/ProjectEmployee/projects`,
    auth: "required",
    permissions: [PermissionsList.ProjectEmployee.GetActiveProjects],
    skipToast: true,
  }),
  setUserProjects: createEndpoint({
    method: "PUT",
    path: `/ProjectEmployee/users/:userId/projects`,
    auth: "required",
    permissions: [PermissionsList.ProjectEmployee.SetProjects],
    skipToast: true,
  }),
};
