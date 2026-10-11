import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { APPROVAL_ROUTES } from "./paths";

const approvalRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: APPROVAL_ROUTES.approval,
            label: "approval.navLabel",
            showInMenu: false,
            order: 45,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/ApprovalPage"
              );
              return { Component };
            },
          },
          {
            path: APPROVAL_ROUTES.myRequests,
            label: "approval.myRequests.navLabel",
            showInMenu: false,
            order: 46,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/MyApprovalRequestsPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default approvalRouteConfig;
