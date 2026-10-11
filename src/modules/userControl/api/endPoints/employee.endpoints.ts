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
  hire: createEndpoint({
    method: "POST",
    path: `/Employee/hire`,
    auth: "required",
    skipToast: true,
  }),
  fire: createEndpoint({
    method: "POST",
    path: `/Employee/fire-employee`,
    auth: "required",
    skipToast: true,
  }),
  activate: createEndpoint({
    method: "POST",
    path: `/Employee/Activate/:userId`,
    auth: "required",
    skipToast: true,
  }),
  deactivate: createEndpoint({
    method: "POST",
    path: `/Employee/Deactivate/:userId`,
    auth: "required",
    skipToast: true,
  }),
  setManager: createEndpoint({
    method: "PUT",
    path: `/Employee/manager`,
    auth: "required",
    skipToast: true,
  }),
  files: createEndpoint({
    method: "GET",
    path: `/Employee/:userId/files`,
    auth: "required",
    skipToast: true,
  }),
  uploadFile: createEndpoint({
    method: "POST",
    path: `/Employee/upload-file`,
    auth: "required",
    skipToast: true,
  }),
  downloadFile: createEndpoint({
    method: "GET",
    path: `/Employee/download-file/:fileId`,
    auth: "required",
    skipToast: true,
  }),
  deleteFile: createEndpoint({
    method: "DELETE",
    path: `/Employee/delete-file/:fileId`,
    auth: "required",
    skipToast: true,
  }),
};
