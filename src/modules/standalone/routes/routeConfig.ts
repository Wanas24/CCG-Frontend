import { lazy } from "react";
import ProtectedRoute from "@/router/guards/ProtectedRoute";
import type { AppRouteObject } from "@/router/types";
import { APP_ROUTES } from "./paths";
import AppLayout from "@/layouts/AppLayout";
import NotFound from "../pages/NotFound";

const HomePage = lazy(() => import("../pages/HomePage"));
const TestPage = lazy(() => import("../pages/TestPage"));

const appRouteConfig: AppRouteObject[] = [
  {
    // Guard first so AppLayout never paints for unauthenticated users.
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          {
            path: APP_ROUTES.home,
            Component: HomePage,
          },
          {
            path: APP_ROUTES.test,
            Component: TestPage,
          },
          {
            path: "*",
            Component: NotFound,
          },
        ],
      },
    ],
  },
];

export default appRouteConfig;
