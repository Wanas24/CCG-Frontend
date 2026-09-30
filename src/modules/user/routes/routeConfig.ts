import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import AppLayout from "@/layouts/AppLayout";
import { USER_ROUTES } from "./paths";

const ProfilePage = lazy(() => import("../pages/ProfilePage"));

const userRouteConfig: AppRouteObject[] = [
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: USER_ROUTES.profile,
            Component: ProfilePage,
            label: "user.profile.title",
            showInMenu: false,
          },
        ],
      },
    ],
  },
];

export default userRouteConfig;
