import { lazy } from "react";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import { USER_ROUTES } from "./paths";

const UserProfile = lazy(() => import("../pages/UserProfile"));

const usersRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: USER_ROUTES.profile,
            Component: UserProfile,
          },
        ],
      },
    ],
  },
];

export default usersRouteConfig;
