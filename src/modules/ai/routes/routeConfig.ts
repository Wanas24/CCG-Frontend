import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { AI_ROUTES } from "./paths";

const AiSubscriptionManagementPage = lazy(
  () => import("../pages/AiSubscriptionManagementPage"),
);

const aiRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: AI_ROUTES.subscriptions,
            Component: AiSubscriptionManagementPage,
            label: "ai.subscriptions.title",
            showInMenu: true,
            order: 40,
          },
        ],
      },
    ],
  },
];

export default aiRouteConfig;
