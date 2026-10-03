import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { USER_CONTROL_ROUTES } from "./paths";

const UserControlPage = lazy(() => import("../pages/UserControl"));

const userRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: USER_CONTROL_ROUTES.userControl,
            Component: UserControlPage,
            label: "User Control",
            showInMenu: false,
          },
        ],
      },
    ],
  },
];

export default userRouteConfig;
