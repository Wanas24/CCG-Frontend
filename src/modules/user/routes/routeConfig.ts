import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { USER_ROUTES } from "./paths";

const userRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: USER_ROUTES.profile,
            label: "user.profile.title",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import("../pages/ProfilePage");
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default userRouteConfig;
