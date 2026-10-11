import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const itemCategoryEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/ItemCategory`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Get],
  }),
  types: createEndpoint({
    method: "GET",
    path: `/ItemCategory/types`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Get],
  }),
  create: createEndpoint({
    method: "POST",
    path: `/ItemCategory`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/ItemCategory`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Edit],
  }),
  delete: createEndpoint({
    method: "DELETE",
    path: `/ItemCategory/:id`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Delete],
  }),
  files: createEndpoint({
    method: "GET",
    path: `/ItemCategory/:id/files`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.GetFiles],
  }),
  uploadFiles: createEndpoint({
    method: "POST",
    path: `/ItemCategory/:id/files`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Upload],
  }),
  deleteFile: createEndpoint({
    method: "DELETE",
    path: `/ItemCategory/files/:fileId`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.DeleteFile],
  }),
  fileUrl: createEndpoint({
    method: "GET",
    path: `/ItemCategory/files/:fileId`,
    auth: "required",
    permissions: [PermissionsList.ItemCategory.Download],
  }),
};
