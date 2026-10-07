import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { REPORT_LAYOUT_ROUTES } from "./paths";

const reportLayoutRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: REPORT_LAYOUT_ROUTES.studio,
            label: "reportLayout.navLabel",
            showInMenu: false,
            order: 46,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/ReportLayoutPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default reportLayoutRouteConfig;
