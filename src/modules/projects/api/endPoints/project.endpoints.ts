import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const projectEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Get],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Project`,
    auth: "required",
    permissions: [PermissionsList.Project.Delete],
  }),
  export: createEndpoint({
    method: "GET",
    path: `/Project/export`,
    auth: "required",
    permissions: [PermissionsList.Project.Export],
    skipToast: true,
  }),
  files: createEndpoint({
    method: "GET",
    path: `/Project/:id/files`,
    auth: "required",
    permissions: [PermissionsList.Project.GetFiles],
    skipToast: true,
  }),
  uploadFile: createEndpoint({
    method: "POST",
    path: `/Project/upload-file`,
    auth: "required",
    permissions: [PermissionsList.Project.Upload],
  }),
  downloadFile: createEndpoint({
    method: "GET",
    path: `/Project/download-file/:fileId`,
    auth: "required",
    permissions: [PermissionsList.Project.Download],
    skipToast: true,
  }),
  deleteFile: createEndpoint({
    method: "DELETE",
    path: `/Project/delete-file/:fileId`,
    auth: "required",
    permissions: [PermissionsList.Project.DeleteFile],
  }),
};
