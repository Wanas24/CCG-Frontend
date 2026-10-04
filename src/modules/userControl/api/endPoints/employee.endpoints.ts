import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const employeeEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Employee`,
    auth: "required",
    permissions: [PermissionsList.Employee.Get],
    skipToast: true,
  }),
  recruit: createEndpoint({
    method: "POST",
    path: `/Employee/Recruitment`,
    auth: "required",
    permissions: [PermissionsList.Employee.RecruitEmployee],
    skipToast: true,
  }),
};
