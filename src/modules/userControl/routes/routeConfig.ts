import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { USER_CONTROL_ROUTES } from "./paths";

const userControlRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: USER_CONTROL_ROUTES.userControl,
            label: "userControl.navLabel",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import("../pages/UserControl");
              return { Component };
            },
          },
          {
            path: USER_CONTROL_ROUTES.usersManager,
            label: "userControl.usersManager.navLabel",
            showInMenu: false,
            lazy: async () => {
              const { default: Component } = await import(
                "../pages/UsersManagerPage"
              );
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

export default userControlRouteConfig;
