import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import { APP_ROUTES } from "./paths";
import AppLayout from "@/layouts/AppLayout";

const appRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: APP_ROUTES.home,
            lazy: async () => {
              const { default: Component } = await import("../pages/HomePage");
              return { Component };
            },
          },
          {
            path: APP_ROUTES.test,
            lazy: async () => {
              const { default: Component } = await import("../pages/TestPage");
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default appRouteConfig;
