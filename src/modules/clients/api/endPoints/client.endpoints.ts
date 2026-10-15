import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const clientEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/Client`,
    auth: "required",
    permissions: [PermissionsList.Client.Get],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/Client`,
    auth: "required",
    permissions: [PermissionsList.Client.Create],
    skipToast: true,
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/Client`,
    auth: "required",
    permissions: [PermissionsList.Client.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/Client`,
    auth: "required",
    permissions: [PermissionsList.Client.Delete],
  }),
  export: createEndpoint({
    method: "GET",
    path: `/Client/export`,
    auth: "required",
    permissions: [PermissionsList.Client.Export],
    skipToast: true,
  }),
  files: createEndpoint({
    method: "GET",
    path: `/Client/:id/files`,
    auth: "required",
    permissions: [PermissionsList.Client.GetFiles],
    skipToast: true,
  }),
  uploadFile: createEndpoint({
    method: "POST",
    path: `/Client/upload-file`,
    auth: "required",
    permissions: [PermissionsList.Client.Upload],
  }),
  downloadFile: createEndpoint({
    method: "GET",
    path: `/Client/download-file/:fileId`,
    auth: "required",
    permissions: [PermissionsList.Client.Download],
    skipToast: true,
  }),
  deleteFile: createEndpoint({
    method: "DELETE",
    path: `/Client/delete-file/:fileId`,
    auth: "required",
    permissions: [PermissionsList.Client.DeleteFile],
  }),
};
