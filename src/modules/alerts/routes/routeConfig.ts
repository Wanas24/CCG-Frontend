import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { ALERTS_ROUTES } from "./paths";

const alertsRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: ALERTS_ROUTES.alerts,
            label: "alerts.title",
            showInMenu: false,
            order: 22,
            lazy: async () => {
              const { default: Component } = await import("../pages/AlertsPage");
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default alertsRouteConfig;
