import { createEndpoint } from "@/lib/api/createEndpoint";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";

export const reportLayoutEndpoints = {
  list: createEndpoint({
    method: "GET",
    path: `/ReportLayout`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.GetLayouts],
    skipToast: true,
  }),
  summary: createEndpoint({
    method: "GET",
    path: `/ReportLayout/summary`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.GetLayouts],
    skipToast: true,
  }),
  getById: createEndpoint({
    method: "GET",
    path: `/ReportLayout/:layoutId`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.GetById],
    skipToast: true,
  }),
  lastUsed: createEndpoint({
    method: "GET",
    path: `/ReportLayout/last-used/:reportType`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.GetLastUsedLayout],
    skipToast: true,
  }),
  create: createEndpoint({
    method: "POST",
    path: `/ReportLayout`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.Create],
  }),
  update: createEndpoint({
    method: "PUT",
    path: `/ReportLayout/:layoutId`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.Update],
  }),
  deactivate: createEndpoint({
    method: "DELETE",
    path: `/ReportLayout/:layoutId`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.Deactivate],
  }),
  preview: createEndpoint({
    method: "POST",
    path: `/ReportLayout/preview-sample`,
    auth: "required",
    permissions: [PermissionsList.ReportLayout.PreviewSample],
    skipToast: true,
  }),
};
