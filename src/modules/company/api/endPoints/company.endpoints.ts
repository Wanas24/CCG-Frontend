import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const companyEndpoints = {
  getCurrent: createEndpoint({
    method: "GET",
    path: `/Company`,
    auth: "required",
    permissions: [PermissionsList.Company.GetCompanyInfo]
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Company`,
    auth: "required",
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Company`,
    auth: "required",
    permissions: [PermissionsList.Company.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Company`,
    auth: "required",
  }),
  uploadLogo: createEndpoint({
    method: "POST",
    path: `/Company/logo`,
    auth: "required",
    permissions: [PermissionsList.Company.UploadLogo],
  }),
  deleteLogo: createEndpoint({
    method: "DELETE",
    path: `/Company/logo`,
    auth: "required",
    permissions: [PermissionsList.Company.DeleteLogo],
  }),
};
