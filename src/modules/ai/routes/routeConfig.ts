import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { AI_ROUTES } from "./paths";

const aiRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: AI_ROUTES.subscriptions,
            label: "ai.subscriptions.title",
            showInMenu: false,
            order: 40,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/AiSubscriptionManagementPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default aiRouteConfig;
